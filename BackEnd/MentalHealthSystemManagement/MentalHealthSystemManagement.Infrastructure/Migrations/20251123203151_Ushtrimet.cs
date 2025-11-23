using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Ushtrimet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ushtrimet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),

                    Titulli = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pershkrimi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataKrijimit = table.Column<DateTime>(type: "datetime2", nullable: false),

                    PsikologId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ushtrimet", x => x.Id);

                    // ✅ FK me tabelat qe veq ekzistojne ne DB
                    table.ForeignKey(
                        name: "FK_Ushtrimet_Psikologet_PsikologId",
                        column: x => x.PsikologId,
                        principalTable: "Psikologet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);

                    table.ForeignKey(
                        name: "FK_Ushtrimet_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // ✅ Indexat per FK
            migrationBuilder.CreateIndex(
                name: "IX_Ushtrimet_PsikologId",
                table: "Ushtrimet",
                column: "PsikologId");

            migrationBuilder.CreateIndex(
                name: "IX_Ushtrimet_PatientId",
                table: "Ushtrimet",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ushtrimet");
        }
    }
}
