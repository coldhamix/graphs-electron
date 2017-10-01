export class Node {
  private static id_counter = 0;

  private id: number;
  private label: string;
  private x: number;
  private y: number;
  private degree: number;

  public static resetIdCounter(): void {
    Node.id_counter = 0;
  }

  constructor() {
    this.id = Node.id_counter++;
    this.label = 'Node ' + Node.id_counter;
    this.x = this.y = this.degree = 0;
  }

  public getId(): number {
    return this.id;
  }

  public getLabel(): string {
    return this.label;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getDegree(): number {
    return this.degree;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public setDegree(degree: number): void {
    this.degree = degree;
  }
}
