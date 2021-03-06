class Construction {

    private PROJECTION_POINT_X: string = 'ProjX';
    private PROJECTION_POINT_Y: string = 'ProjY';
    private PROJECTION_POINT_Z: string = 'ProjZ';
    private ORIGIN: string;
    private ORIGIN_SPHERE: string;

    private ggb: GGBTools;
    private t: Tools;
    private view: View;
    private toStr: TypeString;


    constructor() {
        this.toStr = new TypeString();
        this.ORIGIN = this.toStr.midpoint([0, 0, 0]);
        this.ORIGIN_SPHERE = this.toStr.sphere([0, 0, 0]);
        this.ggb = new GGBTools();
        this.view = new View(this.ggb, this.toStr);
        this.t = new Tools(this.toStr, this.ggb, this.ORIGIN, this.view);
    }

    
    private createInitialSphere(): void {
        var region: number[] = [0, 0, 0];
        this.t.sphereMidpointFree(region, 0, 0, 0);

        var radiusSliderStr: string = this.toStr.radius(region);
        this.ggb.slider(0.1, 1, radiusSliderStr);
        ggbApplet.setValue(radiusSliderStr, Settings.ORIGIN_SPHERE_SCALING);
        var sphereName: string = this.t.sphere(region);
    }

    private createInfinityPoints(): void {
        this.t.pointFree(Settings.PROJECTION_POINT_X_VALUE, 0, 0, this.PROJECTION_POINT_X);
        this.t.pointFree(0, Settings.PROJECTION_POINT_Y_VALUE, 0, this.PROJECTION_POINT_Y);
        this.t.pointFree(0, 0, Settings.PROJECTION_POINT_Z_VALUE, this.PROJECTION_POINT_Z);
    }

    private createInitialTangentplanes(): void {
        var segmentProjX: string = "segmentProjXToOrigin";
        var segmentProjY: string = "segmentProjYToOrigin";
        var segmentProjZ: string = "segmentProjZToOrigin";
        this.view.listOfInvisibleObjects.push(segmentProjX, segmentProjY, segmentProjZ);
        this.ggb.segment(this.ORIGIN, this.PROJECTION_POINT_X, segmentProjX);
        this.ggb.segment(this.ORIGIN, this.PROJECTION_POINT_Y, segmentProjY);
        this.ggb.segment(this.ORIGIN, this.PROJECTION_POINT_Z, segmentProjZ);
        var midpointProjX: string = this.ggb.midpoint(segmentProjX, 'MidOfSegOtoProjX');
        var midpointProjY: string = this.ggb.midpoint(segmentProjY, 'MidOfSegOtoProjY');;
        var midpointProjZ: string = this.ggb.midpoint(segmentProjZ, 'MidOfSegOtoProjZ');

        var radiusProjX: string = this.ggb.distance(midpointProjX, this.ORIGIN, 'r_{' + this.PROJECTION_POINT_X + '}');
        var radiusProjY: string = this.ggb.distance(midpointProjY, this.ORIGIN, 'r_{' + this.PROJECTION_POINT_Y + '}');
        var radiusProjZ: string = this.ggb.distance(midpointProjZ, this.ORIGIN, 'r_{' + this.PROJECTION_POINT_Z + '}');
        var projectionSphereX: string = this.ggb.sphere(midpointProjX, radiusProjX, 's_{' + this.PROJECTION_POINT_X + '}');
        var projectionSphereY: string = this.ggb.sphere(midpointProjY, radiusProjY, 's_{' + this.PROJECTION_POINT_Y + '}');
        var projectionSphereZ: string = this.ggb.sphere(midpointProjZ, radiusProjZ, 's_{' + this.PROJECTION_POINT_Z + '}');
        
        // there seems to be some bug with naming of conics defined by Geogebra's
        // Intersect. Thus we use c,d,e
        var coneX: string = this.ggb.intersect(projectionSphereX, this.ORIGIN_SPHERE, 'c');
        var coneY: string = this.ggb.intersect(projectionSphereY, this.ORIGIN_SPHERE, 'd');
        var coneZ: string = this.ggb.intersect(projectionSphereZ, this.ORIGIN_SPHERE, 'e');
        var coneProjX: string = this.t.renameObject(coneX, 'coneProjX');
        var coneProjY: string = this.t.renameObject(coneY, 'coneProjY');
        var coneProjZ: string = this.t.renameObject(coneZ, 'coneProjZ');

        this.ggb.intersect(coneProjY, coneProjZ, 'TPointX');
        var tPointPosX: string = this.t.renameObject('TPointX_1', this.toStr.tangentPoint([1, 0, 0]));
        var tPointNegX: string = this.t.renameObject('TPointX_2', this.toStr.tangentPoint([-1, 0, 0]));
        this.ggb.intersect(coneProjX, coneProjZ, 'TPointY');
        var tPointNegY: string = this.t.renameObject('TPointY_1', this.toStr.tangentPoint([0, -1, 0]));
        var tPointPosY: string = this.t.renameObject('TPointY_2', this.toStr.tangentPoint([0, 1, 0]));
        this.ggb.intersect(coneProjX, coneProjY, 'TPointZ');
        var tPointPosZ: string = this.t.renameObject('TPointZ_1', this.toStr.tangentPoint([0, 0, 1]));
        var tPointNegZ: string = this.t.renameObject('TPointZ_2', this.toStr.tangentPoint([0, 0, -1]));

        this.ggb.tangentPlaneToSphere(this.ORIGIN_SPHERE, tPointPosX, this.toStr.tangentPlane([1, 0, 0]));
        this.ggb.tangentPlaneToSphere(this.ORIGIN_SPHERE, tPointNegX, this.toStr.tangentPlane([-1, 0, 0]));
        this.ggb.tangentPlaneToSphere(this.ORIGIN_SPHERE, tPointPosY, this.toStr.tangentPlane([0, 1, 0]));
        this.ggb.tangentPlaneToSphere(this.ORIGIN_SPHERE, tPointNegY, this.toStr.tangentPlane([0, -1, 0]));
        this.ggb.tangentPlaneToSphere(this.ORIGIN_SPHERE, tPointPosZ, this.toStr.tangentPlane([0, 0, 1]));
        this.ggb.tangentPlaneToSphere(this.ORIGIN_SPHERE, tPointNegZ, this.toStr.tangentPlane([0, 0, -1]));

        this.view.listOfInvisibleObjects.push(midpointProjX, midpointProjY, midpointProjZ);
        this.view.listOfInvisibleObjects.push(projectionSphereX, projectionSphereY, projectionSphereZ);
        this.view.listOfInvisibleObjects.push(coneProjX, coneProjY, coneProjZ);
        this.view.listOfInvisibleObjects.push(tPointPosX, tPointNegX, tPointNegY, tPointPosY, tPointPosZ, tPointNegZ);

        this.view.listOfInvisiblePlanes.push(this.toStr.tangentPlane([1, 0, 0]), this.toStr.tangentPlane([-1, 0, 0]),
            this.toStr.tangentPlane([0, 1, 0]), this.toStr.tangentPlane([0, -1, 0]), this.toStr.tangentPlane([0, 0, 1]),
            this.toStr.tangentPlane([0, 0, -1]));
    }

    /**
     * @return name of the created object inside GeoGebra
     */
    private parameterMidpoint(planeIndices: number[]): string {
        var regionIndex: string = planeIndices.toString();

        var sliderName = this.toStr.parameter(planeIndices);
        this.ggb.slider(Settings.PARAMETER_SPHERE_MIDPOINT_MIN, Settings.PARAMETER_SPHERE_MIDPOINT_MAX, sliderName,
            Settings.PARAMETER_SPHERE_MIDPOINT_INCREMENT_STEP);
        ggbApplet.setValue(sliderName, 0.5);
        var planeIndicesNegate: number[] = [];
        for (var i: number = 0; i < planeIndices.length; i++) {
            planeIndicesNegate[i] = -planeIndices[i];
        }
        var rayIndices: number[] = planeIndices.concat(planeIndicesNegate);
        var pointName = this.ggb.point(this.toStr.midpointRay(rayIndices), this.toStr.midpoint(planeIndices),
            this.toStr.parameter(planeIndices));
        return pointName;
    }

    private createParameterMidpoints(): void {
        var planeArray = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0],
            [0, 0, 1], [0, 0, -1]];
        this.parameterMidpoint([1, 1, 1]);
        this.parameterMidpoint([-1, 1, 1]);
        this.parameterMidpoint([1, -1, 1]);
        this.parameterMidpoint([1, 1, -1]);
    }

    private createParameterSpheresAndTangentplanes(): void {
        var spheres = [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1]];
        for (var i = 0; i < spheres.length; i++) {
            this.t.radius(spheres[i]);
            this.t.sphere(spheres[i]);
        }

        var plane1Name: string = this.t.reflectTangentPlane(spheres[0], spheres[1], spheres[2]);
        var plane2Name: string = this.t.reflectTangentPlane(spheres[0], spheres[1], spheres[3]);
        var plane3Name: string = this.t.reflectTangentPlane(spheres[0], spheres[2], spheres[3]);
        this.view.listOfInvisiblePlanes.push(plane1Name, plane2Name, plane3Name);
    }

    private createInitialMidpointRays(): void {
        for (var x: number = -1; x < 2; x = x + 2) {
            for (var y: number = -1; y < 2; y = y + 2) {
                for (var z: number = -1; z < 2; z = z + 2) {
                    var ray: string = this.t.rayOfSphereMidpointsFromRegion([0, 0, 0], [x, y, z]);
                    this.view.listOfInvisibleObjects.push(ray);
                }
            }
        }
    }

    private createMissingInitialSpheres(): void {
        this.createMissingFourthInitialSphere([-1, 1, -1], [-1, 1, 1]);
        this.createMissingFourthInitialSphere([1, -1, -1], [1, -1, 1]);
        this.createMissingFourthInitialSphere([-1, -1, 1], [-1, 1, 1]);
    }

    private createMissingFourthInitialSphere(targetRegion: number[], startRegion2: number[]): void {
        var helpRegion: number[] = []; // either [2,0,0], [0,2,0] or [0,0,2]
        for (var i: number = 0; i < targetRegion.length; i++) {
            if (targetRegion[i] == 1) {
                helpRegion[i] = 2;
                helpRegion[(i + 1) % targetRegion.length] = 0;
                helpRegion[(i + 2) % targetRegion.length] = 0;
                break;
            }
        }
        var startRegion1: number[] = [1, 1, 1];
        this.initialMissingSpheresSubroutine(targetRegion, helpRegion, startRegion1, startRegion2);
    }

    private initialMissingSpheresSubroutine(targetRegion: number[], helpRegion: number[],
        startRegion1: number[], startRegion2: number[]): void {
        this.sphereMidpointFromTwoLines(helpRegion, startRegion1, startRegion2);
        this.t.radius(helpRegion);
        this.t.sphere(helpRegion);

        var lineName: string = this.t.lineOfSphereMidpointsFromRegion(helpRegion, targetRegion);
        var lineFromOrigin: string = this.toStr.midpointRayFromOrigin(targetRegion); // strange naming for a line^^
        var midpointStr: string = this.toStr.midpoint(targetRegion);
        var midpoint: string = this.ggb.intersect(lineName, lineFromOrigin, midpointStr);
        this.t.radius(targetRegion);
        this.t.sphere(targetRegion);

        this.view.listOfInvisibleObjects.push(lineName);
    }

    private sphereMidpointFromTwoLines(targetRegion: number[], startRegion1: number[],
        startRegion2: number[]): string {
        var line1: string = this.t.lineOfSphereMidpointsFromRegion(startRegion1, targetRegion);
        var line2: string = this.t.lineOfSphereMidpointsFromRegion(startRegion2, targetRegion);
        var midpoint: string = this.ggb.intersect(line1, line2, this.toStr.midpoint(targetRegion));
        this.view.listOfInvisibleObjects.push(line1, line2);
        return midpoint;
    }

    private constructSecondOrderTangentPlanesInNegDirections(): void {
        var sphereRegionx: number[] = [-1, 1, 1];
        var sphereRegiony: number[] = [1, -1, 1];
        var sphereRegionz: number[] = [1, 1, -1];
        var sphereRegionxy: number[] = [-1, -1, 1];
        var sphereRegionxz: number[] = [-1, 1, -1];
        var sphereRegionyz: number[] = [1, -1, -1];

        var planeInNegXDirection: string = this.t.reflectTangentPlane(sphereRegionx, sphereRegionxy,
            sphereRegionxz);
        var planeInNegYDirection: string = this.t.reflectTangentPlane(sphereRegiony, sphereRegionxy,
            sphereRegionyz);
        var planeInNegZDirection: string = this.t.reflectTangentPlane(sphereRegionz, sphereRegionxz,
            sphereRegionyz);
        this.view.listOfInvisiblePlanes.push(planeInNegXDirection, planeInNegYDirection, planeInNegZDirection);
    }

    private createEighthSphere(): void {
        this.initialMissingSpheresSubroutine([-1, -1, -1], [-2, 0, 0], [-1, -1, 1], [-1, 1, 1]);
    }

    private constructIteratively(): void {
        this.constructInZDirection();
        this.constructInYDirection();
        this.constructInXDirection();
    }

    private constructInYDirection(): void {
        for (var z: number = 0; z < Settings.MAX_REGION_IN_POS_Z_DIR; z += 2) {
            this.constructInSomeYDirection(Settings.MAX_REGION_IN_POS_Y_DIR, true, z);
            this.constructInSomeYDirection(Settings.MAX_REGION_IN_NEG_Y_DIR, false, z);
        }
        for (var z: number = 0; z < Settings.MAX_REGION_IN_NEG_Z_DIR; z += 2) {
            this.constructInSomeYDirection(Settings.MAX_REGION_IN_POS_Y_DIR, true, -z);
            this.constructInSomeYDirection(Settings.MAX_REGION_IN_NEG_Y_DIR, false, -z);
        }
    }

    private constructInXDirection(): void {
        for (var y: number = 0; y < Settings.MAX_REGION_IN_POS_Y_DIR; y += 2) {
            for (var z: number = 0; z < Settings.MAX_REGION_IN_POS_Z_DIR; z += 2) {
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_POS_X_DIR, true, y, z);
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_NEG_X_DIR, false, y, z);
            }

            for (var z: number = 0; z < Settings.MAX_REGION_IN_NEG_Z_DIR; z += 2) {
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_POS_X_DIR, true, y, -z);
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_NEG_X_DIR, false, y, -z);
            }
        }

        for (var y: number = 0; y < Settings.MAX_REGION_IN_NEG_Y_DIR; y += 2) {
            for (var z: number = 0; z < Settings.MAX_REGION_IN_POS_Z_DIR; z += 2) {
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_POS_X_DIR, true, -y, z);
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_NEG_X_DIR, false, -y, z);
            }

            for (var z: number = 0; z < Settings.MAX_REGION_IN_NEG_Z_DIR; z += 2) {
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_POS_X_DIR, true, -y, -z);
                this.constructInSomeXDirection(Settings.MAX_REGION_IN_NEG_X_DIR, false, -y, -z);
            }
        }
    }

    private constructInSomeXDirection(max_x: number, direction: boolean, y: number, z: number) {
        // doc see constructInSomeZDirection
        var sign: number = direction ? +1 : -1
        for (var counterX = 1; counterX < max_x; counterX++) {
            var targetRegions1: Array<number[]>;
            var targetRegions2: Array<number[]>;
            var startRegion1: number[];
            var startRegion2: number[];
            var startRegions1: Array<number[]>;
            var startRegions2: Array<number[]>;
            var x: number = counterX * sign;

            if (Math.abs(x) % 2 == 1) {
                targetRegions1 = [[x + sign, y, z], [x + sign, y + 2, z], [x + sign, y, z + 2]];
                startRegion1 = [x, y + 1, z + 1];
                startRegions1 = [[x, y + 1, z - 1], [x, y + 1, z - 1], [x, y - 1, z + 1]];

                targetRegions2 = [[x + sign, y - 2, z], [x + sign, y, z - 2]];
                startRegion2 = [x, y - 1, z - 1];
                startRegions2 = [[x, y - 1, z + 1, ], [x, y + 1, z - 1]]
            }
            else {
                targetRegions1 = [[x + sign, y + 1, z + 1], [x + sign, y + 1, z - 1],
                    [x + sign, y - 1, z + 1], [x + sign, y - 1, z - 1]];
                startRegion1 = [x, y, z];
                startRegions1 = [[x, y + 2, z], [x, y + 2, z], [x, y - 2, z], [x, y - 2, z]];
            }

            this.createSpheresInTargetRegions(targetRegions1, startRegion1, startRegions1);
            this.createSpheresInTargetRegions(targetRegions2, startRegion2, startRegions2);
            if (z == 0 && y == 0) {
                this.createTangentplaneAndHide(targetRegions1);
            }
        }
    }

    private constructInSomeYDirection(max_y: number, direction: boolean, z: number) {
        // doc see constructInSomeZDirection
        var sign: number = direction ? +1 : -1
        var x: number = 0;
        for (var counterY = 1; counterY < max_y; counterY++) {
            var targetRegions1: Array<number[]>;
            var targetRegions2: Array<number[]>;
            var startRegion1: number[];
            var startRegion2: number[];
            var startRegions1: Array<number[]>;
            var startRegions2: Array<number[]>;
            var y: number = counterY * sign;

            if (Math.abs(y) % 2 == 1) {
                targetRegions1 = [[x, y + sign, z], [x + 2, y + sign, z], [x, y + sign, z + 2]];
                startRegion1 = [x + 1, y, z + 1];
                startRegions1 = [[x + 1, y, z - 1], [x + 1, y, z - 1], [x - 1, y, z + 1]];

                targetRegions2 = [[x - 2, y + sign, z], [x, y + sign, z - 2]];
                startRegion2 = [x - 1, y, z - 1];
                startRegions2 = [[x - 1, y, z + 1, ], [x + 1, y, z - 1]]
            }
            else {
                targetRegions1 = [[x + 1, y + sign, z + 1], [x + 1, y + sign, z - 1],
                    [x - 1, y + sign, z + 1], [x - 1, y + sign, z - 1]];
                startRegion1 = [x, y, z];
                startRegions1 = [[x + 2, y, z], [x + 2, y, z], [x - 2, y, z], [x - 2, y, z]];
            }

            this.createSpheresInTargetRegions(targetRegions1, startRegion1, startRegions1);
            this.createSpheresInTargetRegions(targetRegions2, startRegion2, startRegions2);
            if (z == 0) {
                this.createTangentplaneAndHide(targetRegions1);
            }
        }
    }

    private constructInZDirection(): void {
        this.constructInSomeZDirection(Settings.MAX_REGION_IN_POS_Z_DIR, true)
        this.constructInSomeZDirection(Settings.MAX_REGION_IN_NEG_Z_DIR, false)
    }

    private constructInSomeZDirection(max_z: number, direction: boolean): void {
        /**
         * if direction == true then positive direction, else negative direction
         */
        var sign: number = direction ? +1 : -1
        var x: number = 0;
        var y: number = 0;
        for (var counterZ = 1; counterZ < max_z; counterZ++) {
            var targetRegions1: Array<number[]>;
            var targetRegions2: Array<number[]>;
            var startRegion1: number[];
            var startRegion2: number[];
            var startRegions1: Array<number[]>;
            var startRegions2: Array<number[]>;
            var z: number = counterZ * sign;

            if (Math.abs(z) % 2 == 1) {
                // startRegions1 = spheres in combinatorics_in_tp_100_from_3_spheres.ggb
                // targetRegions1 = spheres in example_combinatorics_in_tp_200_from_4_spheres.ggb
                targetRegions1 = [[x, y, z + sign], [x + 2, y, z + sign], [x, y + 2, z + sign]];
                startRegion1 = [x + 1, y + 1, z];
                startRegions1 = [[x + 1, y - 1, z], [x + 1, y - 1, z], [x - 1, y + 1, z]];

                /**
                 * startRegions2 = remaining 2 spheres in example_combinatorics_in_tp_100_from_4_spheres.ggb
                 * which are not in combinatorics_in_tp_100_from_3_spheres.ggb
                 * targetRegions = remaining 2s spheres in example_combinatorics_in_tp_100_from_4_spheres.ggb 
                 */
                targetRegions2 = [[x - 2, y, z + sign], [x, y - 2, z + sign]];
                startRegion2 = [x - 1, y - 1, z];
                startRegions2 = [[x - 1, y + 1, z], [x + 1, y - 1, z]]
            }
            else {
                targetRegions1 = [[x + 1, y + 1, z + sign], [x + 1, y - 1, z + sign],
                    [x - 1, y + 1, z + sign], [x - 1, y - 1, z + sign]];
                startRegion1 = [x, y, z];
                startRegions1 = [[x + 2, y, z], [x + 2, y, z], [x - 2, y, z], [x - 2, y, z]];
            }

            this.createSpheresInTargetRegions(targetRegions1, startRegion1, startRegions1);
            this.createSpheresInTargetRegions(targetRegions2, startRegion2, startRegions2);
            this.createTangentplaneAndHide(targetRegions1);
        }
    }

    private createSpheresInTargetRegions(targetRegions: Array<number[]>, startRegion1: number[],
        startRegions2: Array<number[]>): void {
        for (var i = 0; i < targetRegions.length; i++) {
            if (!ggbApplet.exists(this.toStr.midpoint(targetRegions[i]))) {
                var midpointName: string = this.sphereMidpointFromTwoLines(targetRegions[i],
                    startRegion1, startRegions2[i]);
                var sphereName: string = this.t.sphere(targetRegions[i]);
                this.view.listOfInvisibleObjects.push(midpointName);
                this.view.listOfInvisibleLabels.push(sphereName);
            }
        }
    }

    private createTangentplaneAndHide(targetRegions: Array<number[]>): void {
        var tPlaneName: string = this.t.reflectTangentPlane(targetRegions[0], targetRegions[1], targetRegions[2]);
        this.view.listOfInvisiblePlanes.push(tPlaneName);
    }

    public run(): void {
        this.createInitialSphere();
        this.createInfinityPoints();
        this.createInitialTangentplanes();
        this.createInitialMidpointRays();
        this.createParameterMidpoints();
        this.createParameterSpheresAndTangentplanes();
        this.createMissingInitialSpheres();
        this.constructSecondOrderTangentPlanesInNegDirections()
        this.createEighthSphere();
        this.constructIteratively();
        this.view.customizeViewProperties();
    }
}