/// <reference path="jslib-modular/tzdraw2d.d.ts" />
/// <reference path="jslib-modular/physics2d.d.ts" />

/// <reference path="rigidSprite.ts"/>
/// <reference path="interfaces.ts"/>

class KnitCube extends RigidSprite implements Buildable
{
    GROW_SPEED = 2;
    maxDimension:number;
    minDimension:number;
    currentDimension:number;
    construct:RigidSprite;
    constructor (options:knitCubeOptions, game:GameObject)
    {
        super(options);
        this.maxDimension = options.maxDimension;
        this.minDimension = options.minDimension;
        this.currentDimension = 0;

        var vertices:number[][] = [[options.initialPos[0], options.initialPos[1]],
            [options.initialPos[0] + this.maxDimension, options.initialPos[1]],
            [options.initialPos[0] + this.maxDimension, options.initialPos[1] - this.maxDimension],
            [options.initialPos[0], options.initialPos[1] - this.maxDimension]];

        var slipperyMaterial:Physics2DMaterial = game.physicsDevice.createMaterial({
            elasticity : 0,
            staticFriction : 0,
            dynamicFriction : 0
        });
        var shape:Physics2DShape = game.physicsDevice.createPolygonShape({
            vertices: vertices,
            material: slipperyMaterial,
            group: 4,
            mask: 13
        });
        var body:Physics2DRigidBody = game.physicsDevice.createRigidBody({
            type: "kinematic",
            shapes: [shape],
            mass: 10
        });
        var sprite:Draw2DSprite = Draw2DSprite.create({
            width: this.maxDimension,
            height: 1,
            origin : [this.maxDimension / 2, this.maxDimension / 2],
            color: [1.0, 1.0, 1.0, 1.0]
        });
        // add the body to the world
        game.physicsWorld.addRigidBody(body);

        this.construct = new RigidSprite({
            sprite:sprite,
            initialPos:options.initialPos,
            body:body
        });
    }

    public buildUp():void
    {
        if (this.currentDimension + this.GROW_SPEED < this.maxDimension) {
            this.currentDimension += this.GROW_SPEED;
            this.remakeConstruct();
        }
    }

    public buildDown():void
    {
        if (this.currentDimension - this.GROW_SPEED > this.minDimension) {
            this.currentDimension -= this.GROW_SPEED;
            this.remakeConstruct();
        }
    }

    private remakeConstruct():void
    {
        var position:number[] = this.body.getPosition();
        if (this.currentDimension > 0)
        {
            this.construct.body.setPosition(position);
            this.construct.sprite.setHeight(this.currentDimension);
            this.construct.sprite.setWidth(this.currentDimension);
        }
    }

    public getBuildableShape():Physics2DShape
    {
        return this.body.shapes[0];
    }

    draw(draw2D:Draw2D, offset:number[]) {
        this.construct.draw(draw2D, offset);
        super.draw(draw2D, offset);
    }
}