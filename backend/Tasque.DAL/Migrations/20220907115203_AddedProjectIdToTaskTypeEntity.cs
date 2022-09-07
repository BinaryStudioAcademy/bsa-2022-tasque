using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class AddedProjectIdToTaskTypeEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "TaskTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TaskTypes_ProjectId",
                table: "TaskTypes",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskTypes_Projects_ProjectId",
                table: "TaskTypes",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskTypes_Projects_ProjectId",
                table: "TaskTypes");

            migrationBuilder.DropIndex(
                name: "IX_TaskTypes_ProjectId",
                table: "TaskTypes");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "TaskTypes");
        }
    }
}
