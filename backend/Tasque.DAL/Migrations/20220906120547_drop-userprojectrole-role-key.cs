using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class dropuserprojectrolerolekey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserProjectRoles",
                table: "UserProjectRoles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserProjectRoles",
                table: "UserProjectRoles",
                columns: new[] { "ProjectId", "UserId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserProjectRoles",
                table: "UserProjectRoles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserProjectRoles",
                table: "UserProjectRoles",
                columns: new[] { "ProjectId", "UserId", "RoleId" });
        }
    }
}
