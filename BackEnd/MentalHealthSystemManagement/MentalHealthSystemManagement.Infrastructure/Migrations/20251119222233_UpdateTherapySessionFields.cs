using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTherapySessionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Exercises",
                table: "TherapySessions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MoodAfter",
                table: "TherapySessions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MoodBefore",
                table: "TherapySessions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SessionNumber",
                table: "TherapySessions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Exercises",
                table: "TherapySessions");

            migrationBuilder.DropColumn(
                name: "MoodAfter",
                table: "TherapySessions");

            migrationBuilder.DropColumn(
                name: "MoodBefore",
                table: "TherapySessions");

            migrationBuilder.DropColumn(
                name: "SessionNumber",
                table: "TherapySessions");
        }
    }
}
