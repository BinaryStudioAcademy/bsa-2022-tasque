using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasque.Core.DAL.Migrations
{
    public partial class roleSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "CreatedAt", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2022, 8, 26, 8, 48, 8, 520, DateTimeKind.Utc).AddTicks(776), "Admin", new DateTime(2022, 8, 26, 8, 48, 8, 520, DateTimeKind.Utc).AddTicks(776) },
                    { 2, new DateTime(2022, 8, 26, 8, 48, 8, 520, DateTimeKind.Utc).AddTicks(778), "Dev", new DateTime(2022, 8, 26, 8, 48, 8, 520, DateTimeKind.Utc).AddTicks(779) },
                    { 3, new DateTime(2022, 8, 26, 8, 48, 8, 520, DateTimeKind.Utc).AddTicks(780), "QA", new DateTime(2022, 8, 26, 8, 48, 8, 520, DateTimeKind.Utc).AddTicks(781) }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
