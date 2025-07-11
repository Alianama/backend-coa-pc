/*
  Warnings:

  - The values [COLOR_DELTA_L,COLOR_DELTA_A,COLOR_DELTA_B,COLOR_DELTA_E,TINT_DELTA_L,TINT_DELTA_A,TINT_DELTA_B,TINT_DELTA_E,DELTA_P,DENSITY,MFR,DISPERSIBILITY,CONTAMINATION,MACARONI,PELLET_LENGTH,PELLET_DIAMETER,VISUAL_CHECK,MOISTURE,CARBON_CONTENT,FOREIGN_MATTER,WEIGHT_OF_CHIPS,INTRINSIC_VISCOSITY,ASH_CONTENT,HEAT_STABILITY,LIGHT_FASTNESS,GRANULE,CACO3,HALS,HIDING,ODOR,NUCLEATING_AGENT] on the enum `product_standards_property_name` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product_standards` MODIFY `property_name` ENUM('colorDeltaL', 'colorDeltaA', 'colorDeltaB', 'colorDeltaE', 'tintDeltaL', 'tintDeltaA', 'tintDeltaB', 'tintDeltaE', 'deltaP', 'density', 'mfr', 'dispersibility', 'contamination', 'macaroni', 'pelletLength', 'pelletDiameter', 'visualCheck', 'moisture', 'carbonContent', 'foreignMatter', 'weightOfChips', 'intrinsicViscosity', 'ashContent', 'heatStability', 'lightFastness', 'granule', 'caCO3', 'hals', 'hiding', 'odor', 'nucleatingAgent') NOT NULL;
