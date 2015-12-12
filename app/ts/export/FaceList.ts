class FaceList extends Array<Face> {

    constructor(private toStr: TypeString, private vertexList: VertexList) {
        super();
    }

    /** returns a string in .OBJ format containing all vertices inside this list. */
    public toOBJString(): string {
        var outputStr = '';
        for (var i = 0; i < this.length; i++) {
            outputStr += this[i].toFaceLineInOBJ();
        }
        return outputStr;
    }

    /** adds UP TO 3 faces to this list, a face is added if it is a proper quadrilateral */
    public addUpTo3Faces(x: number, y: number, z: number): void {
        // NOTE: here and in called methods can be optimized a lot. We run through the whole vertexList way to often.
        if (this.vertexList.isVertexExistent(x, y, z)) {
            this.addFaceInPlane(x, y, z, 0); // yz plane
            this.addFaceInPlane(x, y, z, 1); // xz
            this.addFaceInPlane(x, y, z, 2); // xy
        }
    }

    private addFaceInPlane(x: number, y: number, z: number, normalDir: number): void {
        var indexMatrix = this.getIndexMatrix(x, y, z, normalDir);
        var v1: Vertex = this.vertexList.getVertexByIndex(indexMatrix[0]);
        var v2: Vertex = this.vertexList.getVertexByIndex(indexMatrix[1]);
        var v3: Vertex = this.vertexList.getVertexByIndex(indexMatrix[2]);
        var v4: Vertex = this.vertexList.getVertexByIndex(indexMatrix[3]);
        this.addFace(v1, v2, v3, v4);
    }

    private getIndexMatrix(x: number, y: number, z: number, normalDir: number): number[][] {
        var indexMatrix: number[][] = [[x, y, z], [x, y, z], [x, y, z], [x, y, z]];
        var shiftMatrix: number[][] = Utils.getShiftMatrix();
        var mathjsExt: MathjsExtensions = new MathjsExtensions();
        mathjsExt.switchMatrixColumns(shiftMatrix, 0, normalDir);
        var matrix = math.add(indexMatrix, shiftMatrix) as number[][];
        return matrix;
    }
    
    /** adds face [x,y,z], [x+1,y,z], [x+1,y+1,z]. [x,y+1,z] to the list if the face exists, i.e. all
    *   corresponding vertices exist. */
    private addFaceInXYPlane(x: number, y: number, z: number): void {
        var v1: Vertex = this.vertexList.getByIndex(x, y, z);
        var v2: Vertex = this.vertexList.getByIndex(x + this.oneOrTwo(x), y, z);
        var v3: Vertex = this.vertexList.getByIndex(x + this.oneOrTwo(x), y + this.oneOrTwo(y), z);
        var v4: Vertex = this.vertexList.getByIndex(x, y + this.oneOrTwo(y), z);
        this.addFace(v1, v2, v3, v4);
    }
    
    /** adds face [x,y,z], [x+1,y,z], [x+1,y+1,z]. [x,y+1,z] to the list if the face exists, i.e. all
    *   corresponding vertices exist. */
    private addFaceInXZPlane(x: number, y: number, z: number): void {
        var v1: Vertex = this.vertexList.getByIndex(x, y, z);
        var v2: Vertex = this.vertexList.getByIndex(x + this.oneOrTwo(x), y, z);
        var v3: Vertex = this.vertexList.getByIndex(x + this.oneOrTwo(x), y, z + this.oneOrTwo(z));
        var v4: Vertex = this.vertexList.getByIndex(x, y, z + this.oneOrTwo(z));
        this.addFace(v1, v2, v3, v4);
    }    
    
    /** adds face [x,y,z], [x+1,y,z], [x+1,y+1,z]. [x,y+1,z] to the list if the face exists, i.e. all
    *   corresponding vertices exist. */
    private addFaceInYZPlane(x: number, y: number, z: number): void {
        var v1: Vertex = this.vertexList.getByIndex(x, y, z);
        var v2: Vertex = this.vertexList.getByIndex(x, y + this.oneOrTwo(y), z);
        var v3: Vertex = this.vertexList.getByIndex(x, y + this.oneOrTwo(y), z + this.oneOrTwo(z));
        var v4: Vertex = this.vertexList.getByIndex(x, y, z + this.oneOrTwo(z));
        this.addFace(v1, v2, v3, v4);
    }

    private oneOrTwo(n: number): number {
        if (n == -1) {
            return 2;
        }
        else {
            return 1;
        }
    }

    /** adds the face if all 4 vertices exist */
    private addFace(v1: Vertex, v2: Vertex, v3: Vertex, v4: Vertex): void {
        if (v1 && v2 && v3 && v4) {
            var face = new Face();
            face.add4Vertices(v1, v2, v3, v4);
            this.push(face);
        }
    }
}
