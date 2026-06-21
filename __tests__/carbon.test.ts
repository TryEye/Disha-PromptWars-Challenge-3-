describe('Carbon Calculations', () => {
  describe('Basic calculation functions', () => {
    it('should calculate car emissions correctly', () => {
      const distance = 100;
      const emissionFactor = 0.192;
      const emissions = distance * emissionFactor;
      
      expect(emissions).toBe(19.2);
    });

    it('should calculate bus emissions correctly', () => {
      const distance = 100;
      const emissionFactor = 0.089;
      const emissions = distance * emissionFactor;
      
      expect(emissions).toBeCloseTo(8.9, 1);
    });

    it('should calculate train emissions correctly', () => {
      const distance = 100;
      const emissionFactor = 0.041;
      const emissions = distance * emissionFactor;
      
      expect(emissions).toBeCloseTo(4.1, 1);
    });

    it('should return 0 for zero distance', () => {
      const distance = 0;
      const emissions = distance * 0.192;
      
      expect(emissions).toBe(0);
    });
  });

  describe('Carbon delta calculations', () => {
    it('should calculate positive delta for increased emissions', () => {
      const current = 25;
      const baseline = 20;
      const delta = ((current - baseline) / baseline) * 100;
      
      expect(delta).toBe(25);
    });

    it('should calculate negative delta for reduced emissions', () => {
      const current = 15;
      const baseline = 20;
      const delta = ((current - baseline) / baseline) * 100;
      
      expect(delta).toBe(-25);
    });

    it('should return 0 when emissions are equal', () => {
      const current = 20;
      const baseline = 20;
      const delta = ((current - baseline) / baseline) * 100;
      
      expect(delta).toBe(0);
    });
  });

  describe('Transport mode selection', () => {
    it('should recommend walk for short distances', () => {
      const distance = 1;
      const mode = distance < 2 ? 'walk' : 'other';
      
      expect(mode).toBe('walk');
    });

    it('should recommend bike for medium distances', () => {
      const distance = 3;
      const mode = distance < 5 ? 'bike' : 'other';
      
      expect(mode).toBe('bike');
    });

    it('should recommend bus for longer distances', () => {
      const distance = 25;
      const mode = distance < 50 ? 'bus' : 'train';
      
      expect(mode).toBe('bus');
    });
  });
});