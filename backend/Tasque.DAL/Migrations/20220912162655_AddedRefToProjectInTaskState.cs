using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class AddedRefToProjectInTaskState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "TaskStates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "TaskStates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TaskStates_ProjectId",
                table: "TaskStates",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStates_Projects_ProjectId",
                table: "TaskStates",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskStates_Projects_ProjectId",
                table: "TaskStates");

            migrationBuilder.DropIndex(
                name: "IX_TaskStates_ProjectId",
                table: "TaskStates");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "TaskStates");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "TaskStates");
        }
    }
}
