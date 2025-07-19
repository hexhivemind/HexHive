import { describe, it, expect } from 'vitest';
import {
  email,
  username,
  password,
  emailOrUsername,
  SpriteEntrySchema,
  SpriteFileMapEntrySchema,
} from '~~/shared/zod-helpers';

describe('Zod Primitives', () => {
  it('validates email correctly', () => {
    expect(email.safeParse('test@example.com').success).toBe(true);
    expect(email.safeParse('invalid-email').success).toBe(false);
    expect(email.safeParse('test@').success).toBe(false);
  });

  it('validates username correctly', () => {
    expect(username.safeParse('valid_username').success).toBe(true);
    expect(username.safeParse('invalid username').success).toBe(false);
    expect(username.safeParse('ab').success).toBe(false);
  });

  it('validates password strength', () => {
    expect(password.safeParse('StrongP@ssw0rd').success).toBe(true);
    expect(password.safeParse('weakpassword').success).toBe(false);
    expect(password.safeParse('12345678').success).toBe(false);
    expect(password.safeParse('short').success).toBe(false);
    expect(password.safeParse('NoSpecialChar').success).toBe(false);
  });

  it('validates emailOrUsername correctly', () => {
    expect(emailOrUsername.safeParse('test@example.com').success).toBe(true);
    expect(emailOrUsername.safeParse('valid_username').success).toBe(true);
    expect(emailOrUsername.safeParse('invalid username').success).toBe(false);
    expect(emailOrUsername.safeParse('ab').success).toBe(false);
    expect(emailOrUsername.safeParse('test!').success).toBe(false);
    expect(emailOrUsername.safeParse('test@').success).toBe(false);
  });
});

describe('SpriteEntrySchema', () => {
  it('passes when variant is correct', () => {
    const validData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: 'Back',
    };
    expect(SpriteEntrySchema.safeParse(validData).success).toBe(true);
  });

  it('passes when any variant is accepted', () => {
    const validData = {
      type: 'UI',
      subtype: 'Pokedex',
      variant: 'Digital World',
    };
    expect(SpriteEntrySchema.safeParse(validData).success).toBe(true);
  });

  it('validates when variant is an array', () => {
    const validData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: ['Back', 'Front'],
    };
    expect(SpriteEntrySchema.safeParse(validData).success).toBe(true);
  });

  it('fails when variant array contains invalid value', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: ['Back', 'InvalidVariant'],
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid variant value "InvalidVariant" for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when variant is invalid for type and subtype', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: 'InvalidVariant',
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid variant value "${invalidData.variant}" for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('validates when variant is a record', () => {
    const validData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: {
        shiny: 'Front',
        default: ['Back', 'Front'],
      },
    };
    expect(SpriteEntrySchema.safeParse(validData).success).toBe(true);
  });

  it('fails when variant record contains invalid value', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: {
        shiny: 'Front',
        default: ['Back', 'InvalidVariant'],
      },
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid variant value "InvalidVariant" for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when variant record contains invalid key', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: {
        shiny: 'Front',
        default: ['Back', 'Front'],
        invalidKey: 'InvalidValue',
      },
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid variant value "InvalidValue" for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when variant is missing', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Variant is required for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when variant should not be provided', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Attack',
      variant: 'Back',
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `No variant expected for type "${invalidData.type}" and subtype "${invalidData.subtype}", but one was provided.`,
      );
    }
  });

  it('fails when variant is an empty string', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: '',
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Variant is required for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when variant is an empty array', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: [],
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Variant is required for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when subtype is invalid for type', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'InvalidSubtype',
      variant: 'Back',
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid subtype "${invalidData.subtype}" for type "${invalidData.type}".`,
      );
    }
  });

  it('succeeds when subtype is valid for type with no variant', () => {
    const validData = {
      type: 'Battle',
      subtype: 'Attack',
    };
    const result = SpriteEntrySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails when type is invalid', () => {
    const invalidData = {
      type: 'InvalidType',
      subtype: 'Pokemon',
      variant: 'Back',
    };
    const result = SpriteEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid sprite type: "${invalidData.type}".`,
      );
    }
  });
});

describe('SpriteFileMapEntrySchema', () => {
  it('passes when variant is correct', () => {
    const validData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: 'Back' as string | string[],
    };
    expect(SpriteFileMapEntrySchema.safeParse(validData).success).toBe(true);
    validData.variant = ['shiny', validData.variant as string];
    expect(SpriteFileMapEntrySchema.safeParse(validData).success).toBe(true);
  });

  it('fails when type is incorrect', () => {
    const invalidData = {
      type: 'InvalidType',
      subtype: 'Pokemon',
      variant: 'Back',
    };
    const result = SpriteFileMapEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid sprite type: "${invalidData.type}".`,
      );
    }
  });

  it('fails when variant is invalid for type and subtype', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: 'InvalidVariant',
    };
    const result = SpriteFileMapEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid variant value "${invalidData.variant}" for type "${invalidData.type}" and subtype "${invalidData.subtype}".`,
      );
    }
  });

  it('fails when variant key is invalid', () => {
    const invalidData = {
      type: 'Battle',
      subtype: 'Pokemon',
      variant: ['Invalid', 'Back'],
    };
    const result = SpriteFileMapEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Invalid variant key: "${invalidData.variant[0]}".`,
      );
    }
  });
});
