export type ServiceResponse = {
  readonly success: boolean;
  readonly status: number;
  readonly message?: string;
};

export type ServiceResponseAuth = {
  readonly success: boolean;
  readonly token: string;
  readonly status: number;
  readonly message?: string;
};

export type ServiceResponseItem<T = null> = {
  readonly success: boolean;
  readonly item: T | null;
  readonly status: number;
  readonly message?: string;
};

export type ServiceResponseItems<T = null> = {
  readonly success: boolean;
  readonly items: T[];
  readonly items_count: number;
  readonly status: number;
  readonly page: number;
  readonly per_page: number;
  readonly message?: string;
};

export type ServiceResponseStatus = {
  readonly success: boolean;
  readonly status: number;
};
