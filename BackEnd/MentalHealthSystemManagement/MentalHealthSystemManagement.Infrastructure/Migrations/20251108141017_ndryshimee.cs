using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ndryshimee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Psikologet_PsikologiId",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "AppointmenDate",
                table: "Appointments",
                newName: "AppointmentDate");

            migrationBuilder.AlterColumn<int>(
                name: "PsikologiId",
                table: "Appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "PatientName",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Psikologet_PsikologiId",
                table: "Appointments",
                column: "PsikologiId",
                principalTable: "Psikologet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Psikologet_PsikologiId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientName",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "AppointmentDate",
                table: "Appointments",
                newName: "AppointmenDate");

            migrationBuilder.AlterColumn<int>(
                name: "PsikologiId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Psikologet_PsikologiId",
                table: "Appointments",
                column: "PsikologiId",
                principalTable: "Psikologet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
