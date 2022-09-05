using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Services
{
    public class TaskService
    {
        private DataContext _context;
        private IMapper _mapper;
        private IValidator<User> _validator;
        private FileUploadService _fileUploadService;
    }
}
