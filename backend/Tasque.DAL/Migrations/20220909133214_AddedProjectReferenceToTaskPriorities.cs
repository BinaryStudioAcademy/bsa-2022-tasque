using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class AddedProjectReferenceToTaskPriorities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "TaskPriorities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "TaskPriorities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TaskPriorities_ProjectId",
                table: "TaskPriorities",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskPriorities_Projects_ProjectId",
                table: "TaskPriorities",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskPriorities_Projects_ProjectId",
                table: "TaskPriorities");

            migrationBuilder.DropIndex(
                name: "IX_TaskPriorities_ProjectId",
                table: "TaskPriorities");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "TaskPriorities");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "TaskPriorities");
        }
    }
}
