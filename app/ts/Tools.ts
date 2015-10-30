class Tools {

    constructor(private toStr: TypeString, private ggb: GGBTools, private ORIGIN: string, private view?: View) {
    }
    
    private indexToString(x: number, y: number, z: number): string {
        var str: string = x + ',' + y + ',' + z;
        return str;
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
        return this.ggb.distance(midpoint, this.toStr.tPlane(tpIndex),
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
        var tpIndices: number[] = [planeIndices[0], planeIndices[1], planeIndices[2]];
        var targetRegion: number[] = this.regionIndex(startRegion, tpIndices);
        var direction: number[] = this.midpointRayEmitterDirection(targetRegion, startRegion);
        var midpointRayIndex: number[] = targetRegion.concat(direction);
        var midpointRayName: string = this.toStr.midpointRay(midpointRayIndex);
        var plane1: string = this.toStr.tPlane([planeIndices[0], 0, 0]);
        var plane2: string = this.toStr.tPlane([0, planeIndices[1], 0]);
        var plane3: string = this.toStr.tPlane([0, 0, planeIndices[2]]);

        this.ggb.rayOfSphereMidpoints(this.toStr.sphere(startRegion), plane1,
            plane2, plane3, midpointRayName);
        return midpointRayName;
    }

    rayOfSphereMidpointsFromRegion(startRegion: number[], targetRegion: number[]): string {
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
        return this.rayOfSphereMidpoints(startRegion, planeIndices);
    }

    /**
     * Reflects in the 3 given spheres and also defines the next tangent plane depending on its distance to the Origin.
     * The latter is to assure the correct tp is taken when we reach the projection point. Mirco, don't forget to write
     * this issue down properly!
     */
    reflectIn3Spheres(sphere1: number[], sphere2: number[], sphere3: number[]): string {
        var prevTangentPlaneIndex: number[] = this.prevTangentPlaneIndex(sphere1, sphere2, sphere3);
        var nextTangentPlaneIndex: number[] = this.followingTangentPlaneIndex(prevTangentPlaneIndex);
        var nextTempTpName: string = 'temp' + this.toStr.tPlane(nextTangentPlaneIndex);
        this.ggb.reflectIn3Spheres(this.toStr.sphere(sphere1), this.toStr.sphere(sphere2),
            this.toStr.sphere(sphere3), this.toStr.tPlane(prevTangentPlaneIndex), nextTempTpName)
        this.view.listOfInvisiblePlanes.push(nextTempTpName);
        
        var nextTpName = this.redefineIfNextTpNearerToOriginThanPrevTp(nextTempTpName,
            nextTangentPlaneIndex, prevTangentPlaneIndex);
        return nextTpName;
    }

    /**
     * Define nextTp to be either prevTp or tempNextTp, depending which of these two is farther away from Origin.
     */
    private redefineIfNextTpNearerToOriginThanPrevTp(nextTempTpName: string, nextTangentPlaneIndex: number[],
        prevTangentPlaneIndex: number[]): string {

        var distNextTempTpName: string = this.toStr.distanceOfTempTangentPlane(nextTangentPlaneIndex);
        this.ggb.distanceTpToOrigin(nextTempTpName, this.ORIGIN, distNextTempTpName);

        var prevTpName: string = this.toStr.tPlane(prevTangentPlaneIndex);
        var distPrevTpName: string = this.toStr.distanceOfTangentPlane(prevTangentPlaneIndex);
        this.ggb.distanceTpToOrigin(prevTpName, this.ORIGIN, distPrevTpName);

        var nextTpName: string = this.toStr.tPlane(nextTangentPlaneIndex);
        this.ggb.redefineIfNearerToOrigin(distNextTempTpName, distPrevTpName, nextTempTpName, prevTpName, nextTpName);
        return nextTpName;
    }

    tangentPlaneToThreeSpheres(sphere1: number[], sphere2: number[], sphere3: number[]): string {
        var nextPlaneIndex: number[] = this.nextTangentPlaneIndex(sphere1, sphere2, sphere3);
        var name: string = this.toStr.tPlane(nextPlaneIndex);
        this.ggb.tangentPlaneToThreeSpheresAwayFromOrigin(this.ORIGIN,
            this.toStr.sphere(sphere1), this.toStr.sphere(sphere2), this.toStr.sphere(sphere3),
            name);
        return name;
    }

    private sign(x: number) {
        if (x > 0) {
            return 1;
        }
        else {
            if (x < 0) {
                return -1;
            }
            return 0;
        }
    }

    private followingTangentPlaneIndex(prevTangentPlaneIndex: number[]): number[] {
        var nextTpIndex = prevTangentPlaneIndex.slice();
        for (var i = 0; i < nextTpIndex.length; i++) {
            if (this.sign(nextTpIndex[i]) == 1) {
                nextTpIndex[i] += 1;
            }
            else {
                if (this.sign(nextTpIndex[i]) == -1) {
                    nextTpIndex[i] -= 1;
                }
            }
        }
        return nextTpIndex;
    }

    private nextTangentPlaneIndex(index1: number[], index2: number[], index3: number[]): number[] {
        var commonIndex: number = null;
        for (var i = 0; i < index1.length; i++) {
            // here one might have to use parseInt(indexArray[i]
            if (index1[i] == index2[i]
                && index1[i] == index3[i]) {
                commonIndex = i;
                break;
            }
        }
        var nextPlane: number[] = new Array<number>(3);
        for (var i = 0; i < index1.length; i++) {
            if (i == commonIndex) {
                if (index1[commonIndex] > 0) {
                    nextPlane[i] = 1 + index1[i];
                }
                else {
                    nextPlane[i] = index1[i] - 1;
                }
            } else {
                nextPlane[i] = 0;
            }
        }
        return nextPlane;
    }

    private prevTangentPlaneIndex(index1: number[], index2: number[], index3: number[]): number[] {
        var commonIndex: number = null;
        for (var i = 0; i < index1.length; i++) {
            if (index1[i] == index2[i]
                && index1[i] == index3[i]) {
                commonIndex = i;
                break;
            }
        }
        var prevPlaneIndex: number[] = new Array<number>(index1.length);
        for (var i = 0; i < prevPlaneIndex.length; i++) {
            prevPlaneIndex[i] = 0;
        }
        prevPlaneIndex[commonIndex] = index1[commonIndex];
        return prevPlaneIndex;
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
                if (startRegion[i] > 0) {
                    targetRegion[i] = startRegion[i] - 1;
                }
                else {
                    targetRegion[i] = startRegion[i] + 1;
                }
            }
        }
        return targetRegion;
    }
    
    /**
     * see photos taken on 2015-05-19
     * 
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
}
