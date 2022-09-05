namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/board")]
    public class TaskController : EntityController<Board, BoardDto, BoardService>
    {
        public BoardController(BoardService service, CurrentUserParameters currentUser)
            : base(service, currentUser) { }

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
