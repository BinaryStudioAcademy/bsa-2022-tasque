using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Notifications.Migrations
{
    public partial class PostMergechanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InvitorId",
                table: "UserInvitedNotifications");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvitorId",
                table: "UserInvitedNotifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
