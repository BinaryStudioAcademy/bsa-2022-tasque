using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class removedboardentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardColumns_Boards_BoardId",
                table: "BoardColumns");

            migrationBuilder.DropTable(
                name: "Boards");

            migrationBuilder.RenameColumn(
                name: "BoardId",
                table: "BoardColumns",
                newName: "ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_BoardColumns_BoardId",
                table: "BoardColumns",
                newName: "IX_BoardColumns_ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_BoardColumns_Projects_ProjectId",
                table: "BoardColumns",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardColumns_Projects_ProjectId",
                table: "BoardColumns");

            migrationBuilder.RenameColumn(
                name: "ProjectId",
                table: "BoardColumns",
                newName: "BoardId");

            migrationBuilder.RenameIndex(
                name: "IX_BoardColumns_ProjectId",
                table: "BoardColumns",
                newName: "IX_BoardColumns_BoardId");

            migrationBuilder.CreateTable(
                name: "Boards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Boards_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Boards_ProjectId",
                table: "Boards",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_BoardColumns_Boards_BoardId",
                table: "BoardColumns",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
