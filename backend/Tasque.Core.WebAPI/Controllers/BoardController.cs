using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/board")]
    public class BoardController : ControllerBase
    {
        private readonly BoardService _boardService;

        public BoardController(BoardService service) 
        {
            _boardService = service;
        }

        [HttpGet("{projectId}")]
        public Task<IActionResult> GetBoardByProjectId()
        {
            var result = _boardService.
        }
    }
}
