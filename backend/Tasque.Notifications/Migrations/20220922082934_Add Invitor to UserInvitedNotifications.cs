using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Notifications.Migrations
{
    public partial class AddInvitortoUserInvitedNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvitorId",
                table: "UserInvitedNotifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InvitorId",
                table: "UserInvitedNotifications");
        }
    }
}
