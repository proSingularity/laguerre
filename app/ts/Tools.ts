class Tools {

    constructor(private toStr: TypeString, private ggb: GGBTools, private ORIGIN?: string, private view?: View) {
    }

    pointFree(x: number, y: number, z: number, name?: string): string {
        this.ggb.pointFree(x.toString(), y.toString(), z.toString(), name);
        return name;
    }

    radius(region: number[]): string {
        var tpIndex: number[];
        if (region[0] == 0) {
            tpIndex = [1, 0, 0];
        }
        else {
            tpIndex = [region[0], 0, 0];
        }
        var midpoint: string = this.toStr.midpoint(region);
        var radiusName: string = this.toStr.radius(region);
        return this.ggb.distance(midpoint, this.toStr.tangentPlane(tpIndex),
            radiusName);
    }

    /**
     * Creates a Sphere midpoint with a name of the form "M_{1,2,3}"
     */
    sphereMidpointFree(region: number[], x: number, y: number, z: number): string {
        var name: string = this.toStr.midpoint(region);
        this.pointFree(x, y, z, name);
        return name;
    }

    /**
     * Constructs the sphere in the given region. If the radius does not exist yet, it will be created.
     * Note that the midpoint in that region must exist beforehand.
     * @return the name of the constructed sphere
     */
    sphere(region: number[]): string {
        var midpoint: string = this.toStr.midpoint(region);
        var radius: string = this.toStr.radius(region);
        var sphereName: string = this.toStr.sphere(region);
        if (!ggbApplet.exists(radius)) {
            this.radius(region);
        }
        return this.ggb.sphere(midpoint, radius, sphereName);
    }

    /**
     * @return the newName input
     */
    renameObject(oldName: string, newName: string): string {
        ggbApplet.renameObject(oldName, newName);
        return newName;
    }

    rayOfSphereMidpoints(startRegion: number[], planeIndices: number[]): string {
        var midpointRayIndex: number[] = this.getMidpointLineIndex(startRegion, planeIndices);
        var midpointRayName: string = this.toStr.midpointRay(midpointRayIndex);
        var plane1: string = this.toStr.tangentPlane([planeIndices[0], 0, 0]);
        var plane2: string = this.toStr.tangentPlane([0, planeIndices[1], 0]);
        var plane3: string = this.toStr.tangentPlane([0, 0, planeIndices[2]]);

        this.ggb.rayOfSphereMidpoints(this.toStr.sphere(startRegion), plane1,
            plane2, plane3, midpointRayName);
        return midpointRayName;
    }

    lineOfSphereMidpoints(startRegion: number[], planeIndices: number[]): string {
        var midpointLineIndex: number[] = this.getMidpointLineIndex(startRegion, planeIndices);
        var midpointLineName: string = this.toStr.midpointRay(midpointLineIndex);
        var plane1: string = this.toStr.tangentPlane([planeIndices[0], 0, 0]);
        var plane2: string = this.toStr.tangentPlane([0, planeIndices[1], 0]);
        var plane3: string = this.toStr.tangentPlane([0, 0, planeIndices[2]]);

        this.ggb.lineOfSphereMidpoints(this.toStr.sphere(startRegion), plane1,
            plane2, plane3, midpointLineName);
        return midpointLineName;
    }

    private getMidpointLineIndex(startRegion: number[], planeIndices: number[]): number[] {
        var tpIndices: number[] = [planeIndices[0], planeIndices[1], planeIndices[2]];
        var targetRegion: number[] = this.regionIndex(startRegion, tpIndices);
        var direction: number[] = this.midpointRayEmitterDirection(targetRegion, startRegion);
        return targetRegion.concat(direction);
    }

    lineOfSphereMidpointsFromRegion(startRegion: number[], targetRegion: number[]): string {
        var planeIndices: number[] = this.getPlaneIndicesBetweenRegions(startRegion, targetRegion);
        return this.lineOfSphereMidpoints(startRegion, planeIndices);
    }

    rayOfSphereMidpointsFromRegion(startRegion: number[], targetRegion: number[]): string {
        var planeIndices: number[] = this.getPlaneIndicesBetweenRegions(startRegion, targetRegion);
        return this.rayOfSphereMidpoints(startRegion, planeIndices);
    }

    private getPlaneIndicesBetweenRegions(startRegion: number[], targetRegion: number[]): number[] {
        var planeIndices: number[] = [];
        for (var i: number = 0; i < targetRegion.length; i++) {
            if (Math.abs(targetRegion[i]) == Math.abs(startRegion[i])) {
                throw new Error('Your midpointRay goes to a face instead of a corner. This is not possible by construction. See Tools.ts/rayOfSphereMidpointsFromRegion().'
                    + ' Parameters:\nstartRegion = ' + startRegion.toString() + '\ntargetRegion = ' + targetRegion.toString());
            }
            if (Math.abs(targetRegion[i]) > Math.abs(startRegion[i])) {
                planeIndices[i] = targetRegion[i];
            }
            else {
                planeIndices[i] = startRegion[i];
            }
        }
        return planeIndices
    }

    /**
     * Returns first found common index position of the three arrays, any common index coming after the first one will not be reported.
     * Output will be a number from 0 to a.length.
     * Contract: a,b,c have equal length.
     */
    private getFirstCommonIndexPosition(a: number[], b: number[], c: number[]): number {
        if (a.length != b.length || a.length != c.length) {
            throw new Error("Tools.getFirstCommonIndexPosition(): Lengthes of given arrays are not all equal.  The arrays are: \n a = " +
                a.toString() + "\n b = " + b.toString() + "\n c = " + c.toString())
        }
        for (var i = 0; i < a.length; i++) {
            if (a[i] == b[i] && a[i] == c[i]) {
                return i;
            }
        }
        throw new Error("Tools.getFirstCommonIndexPosition(): no common index. The arrays are: \n a = " + a.toString() + "\n b = "
            + b.toString() + "\n c = " + c.toString())
    }
    
    /**
     * Returns an index array of the form [number, 0, 0].
     * Example a = [1,5,5], b = [1,4,6], c = [1,5,6] will return [1,0,0]
     * Section is in the sense of a cut through space splitting the spheres with the common index.
     */
    private getSectionIndexArray(a: number[], b: number[], c: number[]): number[] {
        var commonIndex: number = this.getFirstCommonIndexPosition(a, b, c);
        var sectionArray: number[] = [];
        for (var i = 0; i < a.length; i++) {
            if (i == commonIndex) {
                sectionArray.push(a[commonIndex]);
            }
            else {
                sectionArray.push(0);
            }
        }
        return sectionArray;
    }

    private getNextTangentPlaneIndex(sphere1: number[], sphere2: number[], sphere3: number[]) {
        var section: number[] = this.getSectionIndexArray(sphere1, sphere2, sphere3);
        for (var i = 0; i < section.length; i++) {
            section[i] = section[i] + this.sign(section[i]); // +-1 if section[i] != 0
        }
        return section;
    }

    reflectTangentPlane(sphere1: number[], sphere2: number[], sphere3: number[]): string {
        var givenTangentPlaneIndex: number[] = this.getSectionIndexArray(sphere1, sphere2, sphere3);
        var nextPlaneIndex: number[] = this.getNextTangentPlaneIndex(sphere1, sphere2, sphere3);
        var name: string = this.toStr.tangentPlane(nextPlaneIndex);
        this.ggb.reflectObjInPlaneSpannedBy3Points(this.toStr.tangentPlane(givenTangentPlaneIndex),
            this.toStr.midpoint(sphere1), this.toStr.midpoint(sphere2), this.toStr.midpoint(sphere3),
            name);
        return name;
    }

    /**
     * Get the index of the next region outlined by the three given tangent planes that is different from the start region.
     * For example tp_{1,0,0}, tp_{0,1,0}, tp_{0,0,1} define region {1,1,1}. The
     * algorithm works since each tangent planes only has one index x or y or
     * z different from 0.
     * @return {number-Array} index of the outlined region
     */
    regionIndex(startRegion: number[], tpIndices: number[]): number[] {
        var targetRegion: number[] = [];
        for (var i: number = 0; i < tpIndices.length; i++) {
            if (Math.abs(startRegion[i]) < Math.abs(tpIndices[i])) {
                targetRegion[i] = tpIndices[i];
            }
            else {
                targetRegion[i] = startRegion[i] - this.sign(startRegion[i]);
            }
        }
        return targetRegion;
    }
    
    /**
     * see photos taken on 2015-05-19
     * TODO what does this one do?
     * @param regionIndex index of the region the ray points into.
     */
    midpointRayEmitterDirection(targetRegion: number[], startRegion: number[]): number[] {
        var direction: number[] = [];
        for (var i: number = 0; i < targetRegion.length; i++) {
            if (targetRegion[i] > startRegion[i]) {
                direction.push(-1);
            } else {
                direction.push(1);
            }
        }
        return direction;
    }

    quad(point1: number[], point2: number[], point3: number[], point4: number[], name?: string): string {
        return this.ggb.quad(this.toStr.planeIntersectionPoint(point1), this.toStr.planeIntersectionPoint(point2),
            this.toStr.planeIntersectionPoint(point3), this.toStr.planeIntersectionPoint(point4), name);
    }

    private sign(number1: number): number {
        if (number1 > 0) {
            return 1;
        }
        else if (number1 < 0) {
            return -1;
        }
        else {
            return 0;
        }
    }
}
