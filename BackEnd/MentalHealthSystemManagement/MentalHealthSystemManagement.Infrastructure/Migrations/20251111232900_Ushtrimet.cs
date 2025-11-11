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
            // Ketu SUPozojme qe kolona PsikologiId dhe indeksi IX_Appointments_PsikologiId ekzistojne tashme.
            // Shtojme vetem FK, por vetem nese nuk ekziston.

            migrationBuilder.Sql(@"
IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Appointments_Psikologet_PsikologiId'
      AND parent_object_id = OBJECT_ID('Appointments')
)
BEGIN
    ALTER TABLE [Appointments] WITH CHECK
    ADD CONSTRAINT [FK_Appointments_Psikologet_PsikologiId]
    FOREIGN KEY([PsikologiId]) REFERENCES [Psikologet]([Id]);
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Heqim FK vetem nese ekziston, qe te mos bjer gabim nese s'ekziston.

            migrationBuilder.Sql(@"
IF EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Appointments_Psikologet_PsikologiId'
      AND parent_object_id = OBJECT_ID('Appointments')
)
BEGIN
    ALTER TABLE [Appointments]
    DROP CONSTRAINT [FK_Appointments_Psikologet_PsikologiId];
END
");
        }
    }
}
