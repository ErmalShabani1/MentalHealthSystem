using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ndryshimeNeNews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_News_Psikologet_PsikologuId",
                table: "News");

            migrationBuilder.DropIndex(
                name: "IX_News_PsikologuId",
                table: "News");

            migrationBuilder.DropColumn(
                name: "PsikologuId",
                table: "News");

            migrationBuilder.CreateIndex(
                name: "IX_News_PsikologId",
                table: "News",
                column: "PsikologId");

            migrationBuilder.AddForeignKey(
                name: "FK_News_Psikologet_PsikologId",
                table: "News",
                column: "PsikologId",
                principalTable: "Psikologet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_News_Psikologet_PsikologId",
                table: "News");

            migrationBuilder.DropIndex(
                name: "IX_News_PsikologId",
                table: "News");

            migrationBuilder.AddColumn<int>(
                name: "PsikologuId",
                table: "News",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_News_PsikologuId",
                table: "News",
                column: "PsikologuId");

            migrationBuilder.AddForeignKey(
                name: "FK_News_Psikologet_PsikologuId",
                table: "News",
                column: "PsikologuId",
                principalTable: "Psikologet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
