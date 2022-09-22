using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class wikiPage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WikiPages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: true),
                    ParentPageId = table.Column<int>(type: "integer", nullable: true),
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    WikiPageId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WikiPages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WikiPages_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WikiPages_WikiPages_WikiPageId",
                        column: x => x.WikiPageId,
                        principalTable: "WikiPages",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_WikiPages_ProjectId",
                table: "WikiPages",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_WikiPages_WikiPageId",
                table: "WikiPages",
                column: "WikiPageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WikiPages");
        }
    }
}
