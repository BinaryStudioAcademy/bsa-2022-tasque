using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class UpdatedInvitationTokenModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "InvitedUserEmail",
                table: "InvitationTokens",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<bool>(
                name: "IsUserExist",
                table: "InvitationTokens",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUserExist",
                table: "InvitationTokens");

            migrationBuilder.AlterColumn<string>(
                name: "InvitedUserEmail",
                table: "InvitationTokens",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
