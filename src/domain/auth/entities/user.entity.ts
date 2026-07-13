export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/**
 * Entidade de domínio User. Representa quem tem permissão de
 * publicar notícias no blog (área /admin protegida por login).
 */
export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static restore(props: UserProps): User {
    return new User(props);
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
}
