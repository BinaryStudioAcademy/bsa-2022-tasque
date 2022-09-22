using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Wiki;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/wiki")]
    [ApiController]
    public class WikiController : EntityController<WikiCreateDto, WikiInfoDto, WikiUpdateDto, int, WikiService>
    {
        public WikiController(WikiService service)
            : base(service)
        {

        }

        [Route("getProjectWiki/{projectId}")]
        [HttpGet]
        public async Task<IActionResult> GetProjectWiki(int projectId)
        {
            var entity = await _service.GetProjectWiki(projectId);

            return Ok(entity);
        }

        [HttpGet("page/{id}")]
        public async Task<IActionResult> GetWikiPage(int id)
        {
            var title = await _service.GetWikiPage(id);

            return Ok(title);
        }

        [Route("update/page/{id}")]
        [HttpPut]
        public virtual async Task<IActionResult> UpdatePage(int id,[FromBody] WikiUpdateDto updateDto)
        {
            var entity = await _service.UpdatePage(id, updateDto);

            return Ok(entity);
        }
    }
}
