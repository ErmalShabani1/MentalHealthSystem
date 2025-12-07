using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthSystemManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ndryshimeNeUshtrime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UshtrimiId",
                table: "TreatmentPlanUshtrimet",
                type: "int",
                nullable: false,
                defaultValue: 0);

           
            migrationBuilder.CreateIndex(
                name: "IX_TreatmentPlanUshtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet",
                column: "UshtrimiId");

           

           

           

            migrationBuilder.AddForeignKey(
                name: "FK_TreatmentPlanUshtrimet_Ushtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet",
                column: "UshtrimiId",
                principalTable: "Ushtrimet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TreatmentPlanUshtrimet_Ushtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet");

           

            migrationBuilder.DropIndex(
                name: "IX_TreatmentPlanUshtrimet_UshtrimiId",
                table: "TreatmentPlanUshtrimet");

            migrationBuilder.DropColumn(
                name: "UshtrimiId",
                table: "TreatmentPlanUshtrimet");
        }
    }
}
