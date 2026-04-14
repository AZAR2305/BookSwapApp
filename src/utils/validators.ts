export const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const isStrongPassword = (value: string) => value.length >= 6;

export const isNonEmpty = (value: string) => value.trim().length > 0;

export const isPositiveNumber = (value: number) => Number.isFinite(value) && value > 0;
