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
    }
}
