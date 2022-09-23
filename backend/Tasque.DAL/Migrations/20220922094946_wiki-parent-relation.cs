using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class wikiparentrelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WikiPages_WikiPages_WikiPageId",
                table: "WikiPages");

            migrationBuilder.DropIndex(
                name: "IX_WikiPages_WikiPageId",
                table: "WikiPages");

            migrationBuilder.DropColumn(
                name: "WikiPageId",
                table: "WikiPages");

            migrationBuilder.CreateIndex(
                name: "IX_WikiPages_ParentPageId",
                table: "WikiPages",
                column: "ParentPageId");

            migrationBuilder.AddForeignKey(
                name: "FK_WikiPages_WikiPages_ParentPageId",
                table: "WikiPages",
                column: "ParentPageId",
                principalTable: "WikiPages",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WikiPages_WikiPages_ParentPageId",
                table: "WikiPages");

            migrationBuilder.DropIndex(
                name: "IX_WikiPages_ParentPageId",
                table: "WikiPages");

            migrationBuilder.AddColumn<int>(
                name: "WikiPageId",
                table: "WikiPages",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WikiPages_WikiPageId",
                table: "WikiPages",
                column: "WikiPageId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_WikiPages_WikiPages_WikiPageId",
                table: "WikiPages",
                column: "WikiPageId",
                principalTable: "WikiPages",
                principalColumn: "Id");
        }
    }
}
