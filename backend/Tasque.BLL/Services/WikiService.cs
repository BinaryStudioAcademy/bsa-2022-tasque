using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.Common.DTO.Wiki;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.BLL.Services
{
    public class WikiService : EntityCrudService<WikiCreateDto, WikiInfoDto, WikiUpdateDto, int, WikiPage>
    {
        public WikiService(DataContext db, IMapper mapper, CurrentUserParameters currentUser)
            : base(db, mapper, currentUser)
        {

        }
        public override async Task<WikiInfoDto> Create(WikiCreateDto createDto)
        {
            int parentLevel = 0;
            var entityToCreate = _mapper.Map<WikiPage>(createDto);

            if (entityToCreate.ParentPageId != null)
            {
                var parentPage = await _dbSet.FirstOrDefaultAsync(x => x.Id == entityToCreate.ParentPageId);

                if (parentPage != null && parentPage.NestedPages != null)
                {
                    parentPage.NestedPages.Add(entityToCreate);
                }

                parentLevel = await NestingСheck(entityToCreate.ParentPageId, parentLevel);

                if (parentLevel >= 4)
                {
                    throw new HttpException(System.Net.HttpStatusCode.BadRequest, "Nesting cannot be more than five");
                }
            }

            await _dbSet.AddAsync(entityToCreate);
            await _db.SaveChangesAsync();

            return _mapper.Map<WikiInfoDto>(entityToCreate);
        }

        private async Task<int> NestingСheck(int? parentPageId, int parentLevel)
        {
            var wikiPage = await _dbSet.FirstOrDefaultAsync(x => x.Id == parentPageId && x.ParentPageId != null);

            if (wikiPage != null)
            {
                parentLevel = await NestingСheck(wikiPage.ParentPageId, ++parentLevel);
            }

            return parentLevel;
        }

        public async Task<List<WikiInfoDto>> GetProjectWiki(int projectId)
        {
            var wikiPages = await _dbSet
                .Where(w => w.ProjectId == projectId && w.ParentPageId == null)
                .OrderBy(x => x.CreatedAt)
                .ToListAsync();

            foreach (var wikiPage in wikiPages)
            {
                wikiPage.NestedPages = await GetNestedPageInfo(wikiPage);
            }

            return _mapper.Map<List<WikiInfoDto>>(wikiPages);
        }

        private async Task<List<WikiPage>?> GetNestedPageInfo(WikiPage basePage)
        {
            var nestedPage = await _dbSet.Where(x => x.ParentPageId == basePage.Id).ToListAsync();

            if (nestedPage != null)
            {
                foreach (var page in nestedPage)
                {
                    page.NestedPages = await GetNestedPageInfo(page);
                }
            }

            return nestedPage;
        }

        public async Task<WikiPageDto> GetWikiPage(int wikiPageId)
        {
            var wikiPage = await _dbSet
                .Where(x => x.Id == wikiPageId)
                .Include(x => x.Project)
                .FirstOrDefaultAsync();

            if (wikiPage == null)
            {
                throw new NotFoundHttpException("No wiki page found with this ID");
            }

            var pageToReturn = _mapper.Map<WikiPageDto>(wikiPage);
            pageToReturn.Title = wikiPage.Project.Name + "/" + await GetParendPageName(wikiPage.ParentPageId, pageToReturn.Name);

            return pageToReturn;
        }

        private async Task<string> GetParendPageName(int? parentId, string title)
        {
            var page = await _dbSet.FirstOrDefaultAsync(x => x.Id == parentId);

            if (page != null && page.ParentPageId != null)
            {
                title = page.Name + "/" + title;
                title = await GetParendPageName(page.ParentPageId, title);
            }
            else if (page != null)
            {
                title = page.Name + "/" + title;
            }

            return title;
        }

        public async Task<WikiPageDto> UpdatePage(int id, WikiUpdateDto updateDto)
        {
            var entity = await _dbSet.FindAsync(id);

            if (entity is null)
            {
                throw new NotFoundHttpException("Wiki page with this key not found");
            }

            _mapper.Map(updateDto, entity);

            _dbSet.Update(entity);
            await _db.SaveChangesAsync();

            return _mapper.Map<WikiPageDto>(entity);

        }

        public override async Task<bool> Delete(int key)
        {
            var entityToDelete = await _dbSet.FirstOrDefaultAsync(x => x.Id == key);

            if (entityToDelete is null)
            {
                throw new NotFoundHttpException($"Wiki with this key not found");
            }

            var pagesToRemove = new List<WikiPage>();
            pagesToRemove = await GetPagesToRemove(pagesToRemove, entityToDelete.Id);

            _dbSet.RemoveRange(pagesToRemove);
            _dbSet.Remove(entityToDelete);
            await _db.SaveChangesAsync();

            return true;
        }

        private async Task<List<WikiPage>> GetPagesToRemove(List<WikiPage> wikiPages, int? parentId)
        {
            var page = await _dbSet.Where(x => x.ParentPageId == parentId).ToListAsync();

            wikiPages.AddRange(page);

            foreach(var item in page)
            {
                await GetPagesToRemove(wikiPages, item.Id);
            }

            return wikiPages;
        }
    }
}
