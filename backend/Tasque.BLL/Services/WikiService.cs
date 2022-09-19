using AutoMapper;
using Microsoft.EntityFrameworkCore;
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

        public async Task<List<WikiInfoDto>> GetProjectWiki(int projectId)
        {
            var wikiPages = await _dbSet
                .Where(w => w.ProjectId == projectId && w.ParentPageId == null)
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

            if(nestedPage != null)
            {
                foreach(var page in nestedPage)
                {
                    page.NestedPages = await GetNestedPageInfo(page);
                }
            }

            return nestedPage;
        }
    }
}
