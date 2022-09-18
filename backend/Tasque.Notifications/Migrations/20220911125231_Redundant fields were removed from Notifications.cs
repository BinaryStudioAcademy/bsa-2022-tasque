using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Notifications.Migrations
{
    public partial class RedundantfieldswereremovedfromNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InviteeName",
                table: "UserInvitedNotifications");

            migrationBuilder.DropColumn(
                name: "InvitorName",
                table: "UserInvitedNotifications");

            migrationBuilder.AddColumn<int>(
                name: "InviteeId",
                table: "UserInvitedNotifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InvitorId",
                table: "UserInvitedNotifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TaskAuthorId",
                table: "TaskMovedNotifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TaskAuthorId",
                table: "TaskCommentedNotifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InviteeId",
                table: "UserInvitedNotifications");

            migrationBuilder.DropColumn(
                name: "InvitorId",
                table: "UserInvitedNotifications");

            migrationBuilder.DropColumn(
                name: "TaskAuthorId",
                table: "TaskMovedNotifications");

            migrationBuilder.DropColumn(
                name: "TaskAuthorId",
                table: "TaskCommentedNotifications");

            migrationBuilder.AddColumn<string>(
                name: "InviteeName",
                table: "UserInvitedNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InvitorName",
                table: "UserInvitedNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
