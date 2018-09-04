type Constructor<T> = new(...args: any[]) => T

export declare function mix<A, B>(ca: A, cb: B)
    : A & Constructor<B>;
export declare function mix<A, B, C>(ca: A, cb: B, cc: C)
    : A & Constructor<B & C>;
export declare function mix<A, B, C, D>(ca: A, cb: B, cc: C, cd: D)
    : A & Constructor<B & C & D>;
export declare function mix<A, B, C, D, E>(ca: A, cb: B, cc: C, cd: D, ce: E)
    : A & Constructor<B & C & D & E>;
export declare function mix<A, B, C, D, E, F>(ca: A, cb: B, cc: C, cd: D, ce: E, cf: F)
    : A & Constructor<B & C & D & E & F>;
export declare function mix<A, B, C, D, E, F, G>(ca: A, cb: B, cc: C, cd: D, ce: E, cf: F, cg: G)
    : A & Constructor<B & C & D & E & F & G>;

export declare function vMix<A, B>(ca: A, cb: B)
    : A & Constructor<B>;
export declare function vMix<A, B, C>(ca: A, cb: B, cc: C)
    : A & Constructor<B & C>;
export declare function vMix<A, B, C, D>(ca: A, cb: B, cc: C, cd: D)
    : A & Constructor<B & C & D>;
export declare function vMix<A, B, C, D, E>(ca: A, cb: B, cc: C, cd: D, ce: E)
    : A & Constructor<B & C & D & E>;
export declare function vMix<A, B, C, D, E, F>(ca: A, cb: B, cc: C, cd: D, ce: E, cf: F)
    : A & Constructor<B & C & D & E & F>;
export declare function vMix<A, B, C, D, E, F, G>(ca: A, cb: B, cc: C, cd: D, ce: E, cf: F, cg: G)
    : A & Constructor<B & C & D & E & F & G>;

export declare function applyMix(cc: Constructor<any>, cs: any[]): void;
