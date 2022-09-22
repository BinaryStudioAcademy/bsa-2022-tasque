using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/comment")]
    [ApiController]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly ITaskService _taskService;
        protected readonly CurrentUserParameters _currentUser;

        public CommentController(ITaskService taskService, CurrentUserParameters currentUser)
        {
            _taskService = taskService;
            _currentUser = currentUser;
        }

        [HttpGet("getCommentsByTaskId/{taskId}")]
        public async Task<IActionResult> GetCommentsByTaskId(int taskId)
        {
            var comments = await _taskService.GetCommentsByTaskId(taskId);
            if (comments == null)
                return NotFound("Comments not found");
            return Ok(comments);
        }

        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CreateCommentDTO dto)
        {
            dto.AuthorId = _currentUser.Id;
            var comment = await _taskService.AddComment(dto);
            return Created(comment.ToString() ?? "", comment);
        }
    }
}
