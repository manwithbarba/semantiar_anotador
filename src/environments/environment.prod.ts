// Production environment (deployed on GitHub Pages).
export const environment = {
  production: true,
  // Single terminology server for dev and prod: SnowstormX demo (implementation-demo).
  terminologyServer: 'https://implementation-demo.snomedtools.org/fhir',
  // Initial edition/language defaults. Detection replaces them only after a
  // known edition is verified; an unavailable server never silently falls back.
  editionUri: 'http://snomed.info/sct',
  displayLanguage: 'en',
};
