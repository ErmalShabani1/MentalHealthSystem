using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ndryshimeneApplicationDbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Patients_PatientId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_TherapySessions_Patients_PatientId",
                table: "TherapySessions");

            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlans_Patients_PatientId",
                table: "TreatmentPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlans_Psikologet_PsikologId",
                table: "TreatmentPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlanUshtrimet_Ushtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Patients_PatientId",
                table: "Notifications",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TherapySessions_Patients_PatientId",
                table: "TherapySessions",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlans_Patients_PatientId",
                table: "TreatmentPlans",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlans_Psikologet_PsikologId",
                table: "TreatmentPlans",
                column: "PsikologId",
                principalTable: "Psikologet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlanUshtrimet_Ushtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet",
                column: "UshtrimiId",
                principalTable: "Ushtrimet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Patients_PatientId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_TherapySessions_Patients_PatientId",
                table: "TherapySessions");

            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlans_Patients_PatientId",
                table: "TreatmentPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlans_Psikologet_PsikologId",
                table: "TreatmentPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlanUshtrimet_Ushtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Patients_PatientId",
                table: "Notifications",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TherapySessions_Patients_PatientId",
                table: "TherapySessions",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlans_Patients_PatientId",
                table: "TreatmentPlans",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlans_Psikologet_PsikologId",
                table: "TreatmentPlans",
                column: "PsikologId",
                principalTable: "Psikologet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlanUshtrimet_Ushtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet",
                column: "UshtrimiId",
                principalTable: "Ushtrimet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
