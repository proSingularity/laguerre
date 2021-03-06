
/**
 * This class contains direct translations of the GeoGebraScript commands to TypeScript. 
 * Therefore most method parameters will be strings.
 */
class GGBTools {

    public distance(objName1: string, objName2: string, name?: string): string {
        var cmd: string = 'Distance[' + objName1 + ', ' + objName2 + ']';
        this.throwErrorIfNotExistentInGGBApplet(objName1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(objName2, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public intersect(objName1: string, objName2: string, name?: string): string {
        var cmd: string = 'Intersect[' + objName1 + ', ' + objName2 + ']';
        this.throwErrorIfNotExistentInGGBApplet(objName1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(objName2, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }
    
    /** for custom tool 'Intersect3Planes' */
    public intersect3Planes(planeName1: string, planeName2: string, planeName3: string, name?: string): string {
        var cmd: string = 'IntersectThreePlanes[' + planeName1 + ', ' + planeName2 + ', ' + planeName3 + ']';
        this.throwErrorIfNotExistentInGGBApplet(planeName1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(planeName2, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(planeName3, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public pointFree(x: string, y: string, z?: string, name?: string): string {
        var cmd: string = '(' + x + ',' + y;
        if (z) {
            cmd = cmd + ',' + z;
        }
        cmd = cmd + ')';
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public point(targetObj: string, name?: string, pathParameter?: string): string {
        var cmd: string = 'Point[' + targetObj;
        if (pathParameter) {
            cmd = cmd + ',' + pathParameter;
        }
        cmd = cmd + ']';
        this.throwErrorIfNotExistentInGGBApplet(targetObj, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public midpoint(targetName: string, name?: string): string {
        var cmd: string = 'Midpoint[' + targetName + ']';
        this.throwErrorIfNotExistentInGGBApplet(targetName, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public reflectObjInPlaneSpannedBy3Points(obj1: string, point1: string, point2: string, point3: string,
        name?: string): string {
        var cmd: string = 'Mirror[' + obj1 + ', Plane[' + point1 + ',' + point2 + ',' + point3 + ']]';
        this.throwErrorIfNotExistentInGGBApplet(obj1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point2, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point3, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public segment(endpoint1: string, endpoint2: string, name?: string): string {
        var cmd: string = 'Segment[' + endpoint1 + ', ' + endpoint2 + ']';
        this.throwErrorIfNotExistentInGGBApplet(endpoint1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(endpoint2, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    /**
     * @param name: string Name of the object inside GeoGebra.
     * @param color: string See GeoGebra page https://wiki.geogebra.org/en/Reference:Colors for reference.
     */
    public setColor(name: string, color: string): void {
        var cmd: string = 'SetColor[' + name + ',' + color + ']';
        this.throwErrorIfNotExistentInGGBApplet(name, cmd, '');
        var isSuccessful: boolean = ggbApplet.evalCommand(cmd);
        if (!isSuccessful) {
            throw new Error(name + ' has not been defined successfully.\nCorresponding command: \n' + cmd);
        }
    }
    
    /**
     * This is not yet the full GeoGebraScript compatible version of a slider. It contains only some parameters.
     */
    public slider(start: number, end: number, name?: string, step: number = 0.1): string {
        var cmd: string = "Slider[" + start.toString() + ", " + end.toString() + ", " + step.toString() + "]";
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    public sphere(midpoint: string, radius: string, name?: string): string {
        var cmd: string = 'Sphere[' + midpoint + ', ' + radius + ']';
        this.throwErrorIfNotExistentInGGBApplet(midpoint, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(radius, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }

    private fullCommand(cmd: string, name: string): string {
        var fullCommand: string = cmd
        if (name) {
            fullCommand = name + ' = ' + fullCommand;
        }
        return fullCommand;
    }

    public tangentPlaneToSphere(sphere: string, point: string, name?: string): string {
        var cmd: string = 'TangentPlaneToSphere[' + sphere + ', ' + point + ']';
        this.throwErrorIfNotExistentInGGBApplet(sphere, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point, cmd, name);
        this.fullCommandAndExec(cmd, name);
        return name;
    }
    
    /**
     * Custom Tool, where the ray emits from from the midpoint of given sphere and goes through the 
     * intersection point of the three planes.
     */
    public rayOfSphereMidpoints(sphere: string, plane1: string, plane2: string, plane3: string, name?: string) {
        var cmd: string = 'RayOfSphereMidpoints[' + sphere + ',' + plane1 + ',' + plane2 + ',' + plane3 + ']';

        this.throwErrorIfNotExistentInGGBApplet(sphere, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(plane1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(plane2, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(plane3, cmd, name);

        this.fullCommandAndExec(cmd, name);
        return name;
    }    
    
    /**
     * Custom Tool, where the ray emits from from the midpoint of given sphere and goes through the 
     * intersection point of the three planes.
     */
    public lineOfSphereMidpoints(sphere: string, plane1: string, plane2: string, plane3: string, name?: string) {
        var cmd: string = 'LineOfSphereMidpoints[' + sphere + ',' + plane1 + ',' + plane2 + ',' + plane3 + ']';

        this.throwErrorIfNotExistentInGGBApplet(sphere, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(plane1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(plane2, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(plane3, cmd, name);

        this.fullCommandAndExec(cmd, name);
        return name;
    }
    
    
    /** Polygon[] tool with just 4 points. */
    public quad(point1: string, point2: string, point3: string, point4: string, name?: string) {
        var cmd: string = 'Polygon[' + point1 + ',' + point2 + ',' + point3 + ',' + point4 + ']';
        this.throwErrorIfNotExistentInGGBApplet(point1, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point2, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point3, cmd, name);
        this.throwErrorIfNotExistentInGGBApplet(point4, cmd, name);

        this.fullCommandAndExec(cmd, name);
        return name;
    }

    /**
     * Checks if the given object objName exists in the GGBApplet. If not it throws an Error naming the full command
     * including definiendum.
     */
    private throwErrorIfNotExistentInGGBApplet(objName: string, cmd: string, definiendum: string) {
        if (!ggbApplet.exists(objName)) {
            throw new Error(objName + ' not existing for command:\n' + this.fullCommand(cmd, definiendum));
        }
        else {
            return true;
        }
    }
    
    /**
     * @return true, if successfully executed command in GeoGebra, else false.
     */
    private fullCommandAndExec(command: string, name: string): boolean {
        command = this.fullCommand(command, name);
        var isSuccessful: boolean = ggbApplet.evalCommand(command);
        if (!isSuccessful) {
            throw new Error(name + ' has not been defined successfully.\nCorresponding command: \n' + command);
        }
        return isSuccessful;
    }


}