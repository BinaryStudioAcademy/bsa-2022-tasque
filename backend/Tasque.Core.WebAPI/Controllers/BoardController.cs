using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Board;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/board")]
    [ApiController]
    [Authorize]
    public class BoardController : ControllerBase
    {
        private readonly BoardService _boardService;

        public BoardController(BoardService service) 
        {
            _boardService = service;
        }

        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetBoardByProjectId(int projectId)
        {
            var result = await _boardService.GetBoardByProjectId(projectId);
            return Ok(result);
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateBoardByProjectId(BoardInfoDto board)
        {
            var result = await _boardService.UpdateBoardColumns(board);
            return Ok(result);
        }
    }
}
