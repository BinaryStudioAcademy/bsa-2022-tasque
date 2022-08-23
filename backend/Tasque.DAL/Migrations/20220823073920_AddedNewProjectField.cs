using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class AddedNewProjectField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Key",
                table: "Projects");
        }
    }
}
