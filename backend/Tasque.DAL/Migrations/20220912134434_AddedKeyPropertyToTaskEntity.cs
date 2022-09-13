using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class AddedKeyPropertyToTaskEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Tasks",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Key",
                table: "Tasks");
        }
    }
}
