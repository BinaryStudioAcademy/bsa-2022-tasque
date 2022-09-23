using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class lastorganization : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastOrganizationId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_LastOrganizationId",
                table: "Users",
                column: "LastOrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Organizations_LastOrganizationId",
                table: "Users",
                column: "LastOrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Organizations_LastOrganizationId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_LastOrganizationId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastOrganizationId",
                table: "Users");
        }
    }
}
