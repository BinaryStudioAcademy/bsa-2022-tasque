using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services
{
    public class OrganizationService : EntityCrudService<Organization>
    {
        private IMapper _mapper;
        public OrganizationService(DataContext db, IMapper mapper) : base(db)
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<Organization>> GetUserOrganizations(int userId)
        {
            var organizations = await _db.Users
                .Where(user => userId == user.Id)
                .SelectMany(user => user.ParticipatedProjects)
                .Union(_db.Users
                    .Where(user => userId == user.Id)
                    .SelectMany(user => user.OwnedProjects))
                .Include(x => x.Organization)
                .Select(project => project.Organization)
                .ToListAsync();

            return organizations;
        }

        public async Task<OrganizationDto> EditOrganization(OrganizationDto organization)
        {
            var organizationEntity = await _db.Organizations.FirstOrDefaultAsync(o => o.Id == organization.Id)
               ?? throw new ValidationException("Organization not found");

            organizationEntity.Name = organization.Name;
            organizationEntity.UpdatedAt = DateTime.UtcNow;

            _db.Organizations.Update(organizationEntity);
            await _db.SaveChangesAsync();
            return _mapper.Map<OrganizationDto>(organizationEntity);

        }

        public async Task<IEnumerable<UserDto>> GetOrganizationUsers(int organizationId)
        {
            var organizationEntity = await _db.Organizations
                .Include(u => u.Users)
                .FirstOrDefaultAsync(o => o.Id == organizationId)
                ?? throw new ValidationException("Organization not found");

            var users = organizationEntity.Users;

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task AddUser(OrganizationDto organizationDto, UserDto userDto)
        {
            var organizationEntity = await _db.Organizations.FirstOrDefaultAsync(o => o.Id == organizationDto.Id)
               ?? throw new ValidationException("Organization not found");

            var user = _mapper.Map<User>(userDto);

            organizationEntity.Users.Add(user);

            await _db.SaveChangesAsync();
        }

        public async Task DeleteUser(OrganizationDto organizationDto, UserDto userDto)
        {
            var organizationEntity = await _db.Organizations.FirstOrDefaultAsync(o => o.Id == organizationDto.Id)
               ?? throw new ValidationException("Organization not found");

            var user = _mapper.Map<User>(userDto);

            organizationEntity.Users.Remove(user);

            await _db.SaveChangesAsync();
        }

    }
}
