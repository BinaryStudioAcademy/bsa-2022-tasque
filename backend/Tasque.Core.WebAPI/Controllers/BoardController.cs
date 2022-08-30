using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/board")]
    public class BoardController : EntityController<Board, BoardDto, BoardService>
    {
        public BoardController(BoardService service) : base(service) { }

        [Route("getUserBoards/{id}")]
        [HttpGet]
        public async virtual Task<IActionResult> GetUserBoards(int id)
        {
            var boards = await _service.GetUserBoards(id);
            if (boards is not null)
            {
                return Ok(boards);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }

    }
}
