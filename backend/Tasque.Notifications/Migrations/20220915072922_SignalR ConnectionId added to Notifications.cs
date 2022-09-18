using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Notifications.Migrations
{
    public partial class SignalRConnectionIdaddedtoNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "UserInvitedNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "TaskMovedNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "TaskCommentedNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "UserInvitedNotifications");

            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "TaskMovedNotifications");

            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "TaskCommentedNotifications");
        }
    }
}
