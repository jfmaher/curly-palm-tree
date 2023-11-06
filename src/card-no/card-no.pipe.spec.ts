import { CardNoPipe } from './card-no.pipe';

describe('CardNoPipe', () => {
  it('should be defined', () => {
    expect(new CardNoPipe()).toBeDefined();
  });

  it('accepts credit card no', () => {
    expect(new CardNoPipe().transform('4012888888881881'));
  });

  it('fails for non numeric', () => {
    expect(new CardNoPipe().transform('sakdljfoeiw'));
  });

  it('fails for wrong length', () => {
    expect(new CardNoPipe().transform('40128888888'));
  });
});
