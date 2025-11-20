using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatmentPlanToDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TreatmentPlans",
                columns: table => new
                {
                    TreatmentPlanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    PsikologId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Goals = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreatmentPlans", x => x.TreatmentPlanId);
                    table.ForeignKey(
                        name: "FK_TreatmentPlans_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TreatmentPlans_Psikologet_PsikologId",
                        column: x => x.PsikologId,
                        principalTable: "Psikologet",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TreatmentPlanUshtrimet",
                columns: table => new
                {
                    TreatmentPlanUshtrimiId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TreatmentPlanId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreatmentPlanUshtrimet", x => x.TreatmentPlanUshtrimiId);
                    table.ForeignKey(
                        name: "FK_TreatmentPlanUshtrimet_TreatmentPlans_TreatmentPlanId",
                        column: x => x.TreatmentPlanId,
                        principalTable: "TreatmentPlans",
                        principalColumn: "TreatmentPlanId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentPlans_PatientId",
                table: "TreatmentPlans",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentPlans_PsikologId",
                table: "TreatmentPlans",
                column: "PsikologId");

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentPlanUshtrimet_TreatmentPlanId",
                table: "TreatmentPlanUshtrimet",
                column: "TreatmentPlanId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TreatmentPlanUshtrimet");

            migrationBuilder.DropTable(
                name: "TreatmentPlans");
        }
    }
}
