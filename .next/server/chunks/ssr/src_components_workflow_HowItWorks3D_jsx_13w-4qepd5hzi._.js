module.exports=[95448,a=>{"use strict";let b,c,d,e;var f=a.i(87924),g=a.i(72131),h=a.i(10129),i=a.i(63903),j=a.i(84755),k=a.i(6087),l=a.i(1236),m=a.i(92431),n=a.i(39705),o=a.i(35258),p=o,q=o;let r=new q.VQ,s=new q.cE;class t extends q.Kx{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new q.ki([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new q.ki([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(a){let b=this.attributes.instanceStart,c=this.attributes.instanceEnd;return void 0!==b&&(b.applyMatrix4(a),c.applyMatrix4(a),b.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(a){let b;a instanceof Float32Array?b=a:Array.isArray(a)&&(b=new Float32Array(a));let c=new q.hC(b,6,1);return this.setAttribute("instanceStart",new q.Zq(c,3,0)),this.setAttribute("instanceEnd",new q.Zq(c,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(a,b=3){let c;a instanceof Float32Array?c=a:Array.isArray(a)&&(c=new Float32Array(a));let d=new q.hC(c,2*b,1);return this.setAttribute("instanceColorStart",new q.Zq(d,b,0)),this.setAttribute("instanceColorEnd",new q.Zq(d,b,b)),this}fromWireframeGeometry(a){return this.setPositions(a.attributes.position.array),this}fromEdgesGeometry(a){return this.setPositions(a.attributes.position.array),this}fromMesh(a){return this.fromWireframeGeometry(new q.nw(a.geometry)),this}fromLineSegments(a){let b=a.geometry;return this.setPositions(b.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new q.VQ);let a=this.attributes.instanceStart,b=this.attributes.instanceEnd;void 0!==a&&void 0!==b&&(this.boundingBox.setFromBufferAttribute(a),r.setFromBufferAttribute(b),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new q.L0),null===this.boundingBox&&this.computeBoundingBox();let a=this.attributes.instanceStart,b=this.attributes.instanceEnd;if(void 0!==a&&void 0!==b){let c=this.boundingSphere.center;this.boundingBox.getCenter(c);let d=0;for(let e=0,f=a.count;e<f;e++)s.fromBufferAttribute(a,e),d=Math.max(d,c.distanceToSquared(s)),s.fromBufferAttribute(b,e),d=Math.max(d,c.distanceToSquared(s));this.boundingSphere.radius=Math.sqrt(d),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(a){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(a)}}var u=o,v=a.i(66110),w=a.i(60554);class x extends u.Zg{constructor(a){super({type:"LineMaterial",uniforms:u.SP.clone(u.SP.merge([v.O.common,v.O.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new u.wq(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${w.f>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(a){this.uniforms.diffuse.value=a}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(a){!0===a?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(a){this.uniforms.linewidth.value=a}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(a){!!a!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===a?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(a){this.uniforms.dashScale.value=a}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(a){this.uniforms.dashSize.value=a}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(a){this.uniforms.dashOffset.value=a}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(a){this.uniforms.gapSize.value=a}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(a){this.uniforms.opacity.value=a}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(a){this.uniforms.resolution.value.copy(a)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(a){!!a!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===a?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(a)}}let y=w.f>=125?"uv1":"uv2",z=new p.$i,A=new p.cE,B=new p.cE,C=new p.$i,D=new p.$i,E=new p.$i,F=new p.cE,G=new p.nd,H=new p._i,I=new p.cE,J=new p.VQ,K=new p.L0,L=new p.$i;function M(a,b,d){return L.set(0,0,-b,1).applyMatrix4(a.projectionMatrix),L.multiplyScalar(1/L.w),L.x=c/d.width,L.y=c/d.height,L.applyMatrix4(a.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class N extends p.kE{constructor(a=new t,b=new x({color:0xffffff*Math.random()})){super(a,b),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let a=this.geometry,b=a.attributes.instanceStart,c=a.attributes.instanceEnd,d=new Float32Array(2*b.count);for(let a=0,e=0,f=b.count;a<f;a++,e+=2)A.fromBufferAttribute(b,a),B.fromBufferAttribute(c,a),d[e]=0===e?0:d[e-1],d[e+1]=d[e]+A.distanceTo(B);let e=new p.hC(d,2,1);return a.setAttribute("instanceDistanceStart",new p.Zq(e,1,0)),a.setAttribute("instanceDistanceEnd",new p.Zq(e,1,1)),this}raycast(a,d){let e,f,g=this.material.worldUnits,h=a.camera;null!==h||g||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let i=void 0!==a.params.Line2&&a.params.Line2.threshold||0;b=a.ray;let j=this.matrixWorld,k=this.geometry,l=this.material;if(c=l.linewidth+i,null===k.boundingSphere&&k.computeBoundingSphere(),K.copy(k.boundingSphere).applyMatrix4(j),g)e=.5*c;else{let a=Math.max(h.near,K.distanceToPoint(b.origin));e=M(h,a,l.resolution)}if(K.radius+=e,!1!==b.intersectsSphere(K)){if(null===k.boundingBox&&k.computeBoundingBox(),J.copy(k.boundingBox).applyMatrix4(j),g)f=.5*c;else{let a=Math.max(h.near,J.distanceToPoint(b.origin));f=M(h,a,l.resolution)}J.expandByScalar(f),!1!==b.intersectsBox(J)&&(g?function(a,d){let e=a.matrixWorld,f=a.geometry,g=f.attributes.instanceStart,h=f.attributes.instanceEnd,i=Math.min(f.instanceCount,g.count);for(let f=0;f<i;f++){H.start.fromBufferAttribute(g,f),H.end.fromBufferAttribute(h,f),H.applyMatrix4(e);let i=new p.cE,j=new p.cE;b.distanceSqToSegment(H.start,H.end,j,i),j.distanceTo(i)<.5*c&&d.push({point:j,pointOnLine:i,distance:b.origin.distanceTo(j),object:a,face:null,faceIndex:f,uv:null,[y]:null})}}(this,d):function(a,d,e){let f=d.projectionMatrix,g=a.material.resolution,h=a.matrixWorld,i=a.geometry,j=i.attributes.instanceStart,k=i.attributes.instanceEnd,l=Math.min(i.instanceCount,j.count),m=-d.near;b.at(1,E),E.w=1,E.applyMatrix4(d.matrixWorldInverse),E.applyMatrix4(f),E.multiplyScalar(1/E.w),E.x*=g.x/2,E.y*=g.y/2,E.z=0,F.copy(E),G.multiplyMatrices(d.matrixWorldInverse,h);for(let d=0;d<l;d++){if(C.fromBufferAttribute(j,d),D.fromBufferAttribute(k,d),C.w=1,D.w=1,C.applyMatrix4(G),D.applyMatrix4(G),C.z>m&&D.z>m)continue;if(C.z>m){let a=C.z-D.z,b=(C.z-m)/a;C.lerp(D,b)}else if(D.z>m){let a=D.z-C.z,b=(D.z-m)/a;D.lerp(C,b)}C.applyMatrix4(f),D.applyMatrix4(f),C.multiplyScalar(1/C.w),D.multiplyScalar(1/D.w),C.x*=g.x/2,C.y*=g.y/2,D.x*=g.x/2,D.y*=g.y/2,H.start.copy(C),H.start.z=0,H.end.copy(D),H.end.z=0;let i=H.closestPointToPointParameter(F,!0);H.at(i,I);let l=p.rB.lerp(C.z,D.z,i),n=l>=-1&&l<=1,o=F.distanceTo(I)<.5*c;if(n&&o){H.start.fromBufferAttribute(j,d),H.end.fromBufferAttribute(k,d),H.start.applyMatrix4(h),H.end.applyMatrix4(h);let c=new p.cE,f=new p.cE;b.distanceSqToSegment(H.start,H.end,f,c),e.push({point:f,pointOnLine:c,distance:b.origin.distanceTo(f),object:a,face:null,faceIndex:d,uv:null,[y]:null})}}}(this,h,d))}}onBeforeRender(a){let b=this.material.uniforms;b&&b.resolution&&(a.getViewport(z),this.material.uniforms.resolution.value.set(z.z,z.w))}}class O extends t{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(a){let b=a.length-3,c=new Float32Array(2*b);for(let d=0;d<b;d+=3)c[2*d]=a[d],c[2*d+1]=a[d+1],c[2*d+2]=a[d+2],c[2*d+3]=a[d+3],c[2*d+4]=a[d+4],c[2*d+5]=a[d+5];return super.setPositions(c),this}setColors(a,b=3){let c=a.length-b,d=new Float32Array(2*c);if(3===b)for(let e=0;e<c;e+=b)d[2*e]=a[e],d[2*e+1]=a[e+1],d[2*e+2]=a[e+2],d[2*e+3]=a[e+3],d[2*e+4]=a[e+4],d[2*e+5]=a[e+5];else for(let e=0;e<c;e+=b)d[2*e]=a[e],d[2*e+1]=a[e+1],d[2*e+2]=a[e+2],d[2*e+3]=a[e+3],d[2*e+4]=a[e+4],d[2*e+5]=a[e+5],d[2*e+6]=a[e+6],d[2*e+7]=a[e+7];return super.setColors(d,b),this}fromLine(a){let b=a.geometry;return this.setPositions(b.attributes.position.array),this}}class P extends N{constructor(a=new O,b=new x({color:0xffffff*Math.random()})){super(a,b),this.isLine2=!0,this.type="Line2"}}let Q=g.forwardRef(function({points:a,color:b=0xffffff,vertexColors:c,linewidth:d,lineWidth:e,segments:f,dashed:h,...i},k){var l,m;let p=(0,j.f)(a=>a.size),q=g.useMemo(()=>f?new N:new P,[f]),[r]=g.useState(()=>new x),s=(null==c||null==(l=c[0])?void 0:l.length)===4?4:3,u=g.useMemo(()=>{let d=f?new t:new O,e=a.map(a=>{let b=Array.isArray(a);return a instanceof o.cE||a instanceof o.$i?[a.x,a.y,a.z]:a instanceof o.wq?[a.x,a.y,0]:b&&3===a.length?[a[0],a[1],a[2]]:b&&2===a.length?[a[0],a[1],0]:a});if(d.setPositions(e.flat()),c){b=0xffffff;let a=c.map(a=>a instanceof o.Es?a.toArray():a);d.setColors(a.flat(),s)}return d},[a,f,c,s]);return g.useLayoutEffect(()=>{q.computeLineDistances()},[a,q]),g.useLayoutEffect(()=>{h?r.defines.USE_DASH="":delete r.defines.USE_DASH,r.needsUpdate=!0},[h,r]),g.useEffect(()=>()=>{u.dispose(),r.dispose()},[u]),g.createElement("primitive",(0,n.f)({object:q,ref:k},i),g.createElement("primitive",{object:u,attach:"geometry"}),g.createElement("primitive",(0,n.f)({object:r,attach:"material",color:b,vertexColors:!!c,resolution:[p.width,p.height],linewidth:null!=(m=null!=d?d:e)?m:1,dashed:h,transparent:4===s},i)))});var R=a.i(55482);let S="#e0a56e",T="#9a6a44",U="#3b3631",V="#12a37a",W="#0a0a0b",X=(a,b,c)=>{let d=o.rB.clamp((c-a)/(b-a),0,1);return d*d*(3-2*d)},Y=(a,b,c,d)=>X(a-c,a,d)*(1-X(b,b+c,d)),Z=new Map;function $(a,b){let c=Z.get(a);return c||(c=b(),Z.set(a,c)),c}let _=(a,b,c,d)=>$(`b${a}_${b}_${c}_${d}`,()=>new R.f(a,b,c,5,d));class aa{pts;cum=[0];len;constructor(a){this.pts=a.map(a=>new o.cE(...a));for(let a=1;a<this.pts.length;a++)this.cum.push(this.cum[a-1]+this.pts[a].distanceTo(this.pts[a-1]));this.len=this.cum[this.cum.length-1]}at(a,b){let c=o.rB.clamp(a,0,1)*this.len,d=1;for(;d<this.cum.length-1&&this.cum[d]<c;)d++;let e=this.pts[d-1],f=this.pts[d],g=this.cum[d]-this.cum[d-1]||1;return b.lerpVectors(e,f,(c-this.cum[d-1])/g),Math.atan2(-(f.z-e.z),f.x-e.x)}ratio(a){return this.cum[a]/this.len}dense(a=.12){let b=[this.pts[0].clone()];for(let c=1;c<this.pts.length;c++){let d=this.pts[c-1],e=this.pts[c],f=Math.max(1,Math.round(d.distanceTo(e)/a));for(let a=1;a<=f;a++)b.push(new o.cE().lerpVectors(d,e,a/f))}return b}}let ab=[-5.6,0,1.3],ac=[5.6,0,-1.3],ad=new aa([[-4.3,.025,1],[-3.3,.025,1],[-3.3,.025,0],[-2.55,.025,0],[-2.4,.215,0],[-1.75,.215,0],[-.9,.215,0],[0,.215,0],[.9,.215,0],[1.75,.215,0],[2.4,.215,0],[2.55,.025,0],[3.3,.025,0],[3.3,.025,-1.3],[4.2,.025,-1.3]]),ae=ad.ratio(4),af=ad.ratio(10),ag=new aa([[5.6,.025,-2.75],[5.6,.025,-3.3],[-5.6,.025,-3.3],[-5.6,.025,-.15]]);function ah(a){return a<1?o.rB.lerp(.02,ae,X(.05,.95,a)):a<2?o.rB.lerp(ae,af,X(1,1.9,a)):o.rB.lerp(af,1,X(2,2.35,a))}let ai=null;function aj(){if(!ai){let a=getComputedStyle(document.documentElement),b=(b,c)=>{let d=a.getPropertyValue(b).trim();return d?`${d}, ${c}`:c};ai={sans:b("--font-inter","system-ui, sans-serif"),mono:b("--font-jetbrains","ui-monospace, monospace")}}return ai}function ak(a,b,c,d,e,f){a.beginPath(),a.roundRect(b,c,d,e,f)}function al(a,b,c,d,e,f,g="left"){a.font=e,a.fillStyle=f,a.textAlign=g,a.textBaseline="alphabetic",a.fillText(b,c,d)}function am(a){a.needsUpdate=!0}function an(a,b,c,d,e=12){let f=(0,g.useMemo)(()=>{let c=document.createElement("canvas");c.width=a,c.height=b;let d=c.getContext("2d"),e=new o.Nk(c);return e.colorSpace=o.nj,e.anisotropy=8,{ctx:d,tex:e}},[a,b]),h=(0,g.useRef)(-1);return(0,g.useEffect)(()=>()=>f.tex.dispose(),[f]),(0,i.f)(({clock:a})=>{let b=a.elapsedTime;b-h.current<1/e||(h.current=b,c(f.ctx,d.current,b),am(f.tex))}),f.tex}function ao(a,b,c){let d=aj(),e=1-X(.45,.9,b),f=X(.05,.35,b)*(1-X(2.2,2.6,b)),g=X(3,3.3,b);a.clearRect(0,0,520,1060),ak(a,0,0,520,1060,56),a.fillStyle="#0e0c0a",a.fill(),al(a,"AURLYNN · INBOUND",40,74,`500 21px ${d.mono}`,"#8c8279"),al(a,"SRTP",480,74,`500 21px ${d.mono}`,g>.5?V:S,"right");if(e>.05){let b=.9*c%1;a.strokeStyle=`rgba(224,165,110,${(1-b)*.5*e})`,a.lineWidth=3,a.beginPath(),a.arc(260,262,78+44*b,0,2*Math.PI),a.stroke()}if(a.beginPath(),a.arc(260,262,76,0,2*Math.PI),a.fillStyle="#1c1814",a.fill(),a.strokeStyle=g>.5?V:S,a.lineWidth=3,a.stroke(),al(a,"C",260,282,`600 58px ${d.sans}`,"#f4efe7","center"),al(a,"Customer",260,408,`600 44px ${d.sans}`,"#f4efe7","center"),al(a,"+1 (415) 555-0142",260,452,`400 27px ${d.sans}`,"#8c8279","center"),e>.5){let b=.55+.45*Math.abs(Math.sin(4*c));al(a,"Incoming call…",260,510,`500 28px ${d.sans}`,`rgba(224,165,110,${b})`,"center")}else{let c=Math.round(47*X(.3,3.7,b)),e=String(Math.floor(c/60)).padStart(2,"0"),f=String(c%60).padStart(2,"0");a.beginPath(),a.arc(164,502,7,0,2*Math.PI),a.fillStyle=V,a.fill(),al(a,"Connected",182,512,`500 28px ${d.sans}`,"#f4efe7","left"),al(a,`${e}:${f}`,410,512,`500 30px ${d.mono}`,"#cfc6ba","right")}al(a,g>.5?"AURLYNN AI":"CUSTOMER",40,584,`500 19px ${d.mono}`,"#8c8279");let h=5*e+46*f+46*g;for(let b=0;b<30;b++){let d=40+b/29*440,e=6+h*(.35+.65*Math.sin(b/29*Math.PI))*(.35+.65*Math.abs(Math.sin(7*c+.9*b)));ak(a,d-4,660-e,8,2*e,4),a.fillStyle=g>.5?V:S,a.fill()}ak(a,36,746,448,76,20),a.fillStyle="#171310",a.fill(),al(a,"VOICE · ENCRYPTED",62,792,`500 20px ${d.mono}`,"#cfc6ba");let i=g>.5?-1:1;for(let b=0;b<3;b++){let d=((1.4*c-.25*b)%1+1)%1;a.fillStyle=`rgba(${g>.5?"18,163,122":"224,165,110"},${.25+.75*(1-d)})`;let e=402+(1===i?b:2-b)*22;a.beginPath(),1===i?(a.moveTo(e,770),a.lineTo(e+14,780),a.lineTo(e,790)):(a.moveTo(e+14,770),a.lineTo(e,780),a.lineTo(e+14,790)),a.closePath(),a.fill()}["Phone","Web","App"].forEach((b,c)=>{let e=36+154*c;ak(a,e,852,140,56,28),0===c?(a.fillStyle="rgba(224,165,110,.16)",a.fill(),a.strokeStyle=S):a.strokeStyle="#3a342e",a.lineWidth=2,a.stroke(),al(a,b,e+70,888,`500 23px ${d.sans}`,0===c?"#f4efe7":"#8c8279","center")}),[150,260,370].forEach((b,c)=>{if(a.beginPath(),a.arc(b,968,36,0,2*Math.PI),a.fillStyle=2===c?"#c2392b":"#1c1814",a.fill(),a.fillStyle="#f4efe7",0===c&&(ak(a,b-6,950,12,26,6),a.fill()),1===c)for(let c=0;c<3;c++)for(let d=0;d<3;d++)a.fillRect(b-15+12*d,953+12*c,7,7);2===c&&(ak(a,b-16,962,32,9,4),a.fill())})}function ap(a,b,c){let d=aj(),e=Math.round(87*X(.9,1.7,b)),f=Y(.9,2.1,.4,b);a.clearRect(0,0,640,200),ak(a,0,0,640,200,22),a.fillStyle="#14110f",a.fill(),a.strokeStyle=f>.2?S:"#3a342e",a.lineWidth=2,a.stroke(),al(a,"EDGE ROUTER",32,48,`500 20px ${d.mono}`,"#8c8279"),al(a,"TLS 1.3 · SRTP · AES-256",32,78,`500 18px ${d.mono}`,f>.2?S:"#6b625a"),al(a,b<.9?"—":String(e).padStart(3,"0"),30,160,`500 84px ${d.mono}`,"#f4efe7"),al(a,"ms",172,160,`500 26px ${d.mono}`,"#8c8279"),al(a,"END-TO-END LATENCY",232,160,`500 16px ${d.mono}`,"#6b625a"),["SIN","FRA","IAD"].forEach((b,e)=>{let g=40+44*e;al(a,b,468,g+14,`500 18px ${d.mono}`,"#8c8279"),ak(a,516,g,92,12,6),a.fillStyle="#2a241f",a.fill(),ak(a,516,g,92*(.25+f*(.5+.2*Math.sin(2*c+e))),12,6),a.fillStyle=S,a.fill()})}function aq(a,b,c){let d=aj();a.clearRect(0,0,640,200),ak(a,0,0,640,200,22),a.fillStyle="#14110f",a.fill(),a.save(),a.translate(34,40),a.scale(4.2,4.2),a.fillStyle="#f4efe7",a.fill(new Path2D("M16 2 28 24H4L16 2Z")),a.strokeStyle=T,a.lineWidth=1.6,a.stroke(new Path2D("M4 24 16 14l12 10")),a.fillStyle="#e7c6a4",a.beginPath(),a.arc(16,19,2.2,0,2*Math.PI),a.fill(),a.restore(),a.letterSpacing="8px",al(a,"AURLYNN",190,92,`500 40px ${d.sans}`,"#f4efe7"),a.letterSpacing="3px",al(a,"VOICE AGENT",192,130,`500 18px ${d.mono}`,"#8c8279"),a.letterSpacing="0px";let e=b<1.2?0:b<2.3?1:b<3?2:3,f=[{t:"STANDBY",c:"#8c8279"},{t:"LISTENING",c:S},{t:"PROCESSING",c:S},{t:"RESPONDING",c:V}][e];a.beginPath(),a.arc(196,166,7,0,2*Math.PI),a.fillStyle=f.c,a.globalAlpha=0===e?1:.55+.45*Math.abs(Math.sin(4*c)),a.fill(),a.globalAlpha=1,al(a,f.t,214,173,`500 22px ${d.mono}`,f.c)}let ar="“Can I book a table for Friday at 7?”",as=[[1,1.3,2.5,2.7],[2.3,2.5,2.75,2.9],[2.6,2.8,3.05,3.2],[3,3.25,99,100]],at=(a,b)=>{let[c,d,e,f]=as[a];return X(c,d,b)*(1-X(e,f,b))};function au(a,b,c,d,e){let f=aj();a.clearRect(0,0,780,240),ak(a,0,0,780,240,26),a.fillStyle="#14110f",a.fill(),a.strokeStyle=b>.3?S:"#3a342e",a.lineWidth=2.5,a.stroke(),a.beginPath(),a.arc(40,46,7,0,2*Math.PI),a.fillStyle=b>.3?S:"#4a423b",a.fill(),a.letterSpacing="2px",al(a,`${c}  ${d}`,60,53,`500 21px ${f.mono}`,b>.3?"#f4efe7":"#8c8279"),al(a,e,744,53,`500 18px ${f.mono}`,"#6b625a","right"),a.letterSpacing="0px"}function av(a,b,c){let d=aj(),e=at(0,b);au(a,e,"01","LISTEN","ASR · STREAMING");let f=Math.floor(ar.length*X(1.5,2.35,b));al(a,ar.slice(0,f)+(e>.3&&Math.floor(2*c)%2==0&&f<ar.length?"▍":""),40,130,`500 32px ${d.sans}`,"#f4efe7");for(let b=0;b<40;b++){let d=4+22*e*Math.abs(Math.sin(6*c+.8*b))*(.4+.6*Math.sin(b/40*Math.PI));ak(a,40+17.5*b,196-d/2,7,d,3),a.fillStyle=e>.3?S:"#3a342e",a.fill()}}function aw(a,b){let c=aj();au(a,at(1,b),"02","UNDERSTAND","INTENT · ENTITIES");let d=X(2.3,2.55,b);d>.05?(a.globalAlpha=d,ak(a,40,86,332,50,25),a.fillStyle=T,a.fill(),al(a,"Intent · Book reservation",62,120,`500 25px ${c.sans}`,"#fff"),al(a,"CONFIDENCE",40,176,`500 17px ${c.mono}`,"#8c8279"),ak(a,190,162,400,12,6),a.fillStyle="#2a241f",a.fill(),ak(a,190,162,Math.max(12,384*X(2.35,2.7,b)),12,6),a.fillStyle=S,a.fill(),al(a,`${Math.round(96*X(2.35,2.7,b))}%`,740,175,`500 22px ${c.mono}`,"#f4efe7","right"),al(a,"Fri · 7:00 PM · Party of 2",40,218,`400 21px ${c.sans}`,"#8c8279"),a.globalAlpha=1):al(a,"Waiting for utterance…",40,130,`400 26px ${c.sans}`,"#4a423b")}function ax(a,b,c){let d=aj(),e=at(2,b);au(a,e,"03","ACT","TOOL EXECUTION"),["Check availability","Create booking","Send confirmation"].forEach((f,g)=>{let h=100+44*g,i=X(2.65+.1*g,2.76+.1*g,b),j=0===g?1:X(2.65+(g-1)*.1,2.76+(g-1)*.1,b),k=e>.3&&i<.5&&j>.5;a.beginPath(),a.arc(52,h-8,13,0,2*Math.PI),i>.5?(a.fillStyle=V,a.fill(),a.strokeStyle="#fff",a.lineWidth=3,a.beginPath(),a.moveTo(45,h-8),a.lineTo(50,h-3),a.lineTo(59,h-14)):(a.strokeStyle=k?S:"#4a423b",a.lineWidth=3,k&&(a.beginPath(),a.arc(52,h-8,13,6*c,6*c+1.3*Math.PI))),a.stroke(),al(a,f,82,h,`500 26px ${d.sans}`,i>.5?"#f4efe7":"#8c8279"),al(a,i>.5?"DONE":k?"RUNNING":"QUEUED",740,h,`500 17px ${d.mono}`,i>.5?V:k?S:"#4a423b","right")})}function ay(a,b,c){let d=aj(),e=at(3,b);au(a,e,"04","RESPOND","TTS · NEURAL VOICE"),al(a,"“You’re all set for Friday at 7 PM.”",40,116,`500 30px ${d.sans}`,e>.2?"#f4efe7":"#6b625a");for(let b=0;b<38;b++){let d=5+24*e*Math.abs(Math.sin(6.5*c+.7*b))*(.4+.6*Math.sin(b/38*Math.PI));ak(a,40+12.2*b,168-d/2,6,d,3),a.fillStyle=e>.2?V:"#3a342e",a.fill()}ak(a,520,150,224,52,26),a.strokeStyle="#3a342e",a.lineWidth=2,a.stroke(),a.beginPath(),a.arc(548,176,6,0,2*Math.PI),a.fillStyle=V,a.fill(),al(a,"Human handoff · standby",562,183,`500 17px ${d.sans}`,"#cfc6ba")}function az({text:a,on:b,y:c}){let{ctx:d,tex:e}=(0,g.useMemo)(()=>{let a=document.createElement("canvas");a.width=520,a.height=96;let b=new o.Nk(a);return b.colorSpace=o.nj,b.anisotropy=4,{ctx:a.getContext("2d"),tex:b}},[]);return(0,g.useEffect)(()=>()=>e.dispose(),[e]),(0,g.useEffect)(()=>{let c;c=aj(),d.clearRect(0,0,520,96),ak(d,4,8,512,80,40),d.fillStyle=b?W:"rgba(255,255,255,.88)",d.fill(),d.strokeStyle=b?W:"rgba(10,10,11,.18)",d.lineWidth=3,d.stroke(),d.letterSpacing="5px",al(d,a.toUpperCase(),262,60,`500 30px ${c.mono}`,b?"#ffffff":"#55555c","center"),d.letterSpacing="0px",am(e)},[d,e,a,b]),(0,f.jsx)(k.f,{position:[0,c,0],children:(0,f.jsxs)("mesh",{renderOrder:10,children:[(0,f.jsx)("planeGeometry",{args:[2.6,.48]}),(0,f.jsx)("meshBasicMaterial",{map:e,transparent:!0,toneMapped:!1,depthTest:!1})]})})}function aA({pts:a,color:b,width:c,s:d,level:e}){let h=(0,g.useRef)(null),j=a.length-1;return(0,i.f)(()=>{h.current&&(h.current.geometry.instanceCount=Math.floor(j*o.rB.clamp(e(d.current),0,1)))}),(0,f.jsx)(Q,{ref:a=>{h.current=a},points:a,color:b,lineWidth:c,toneMapped:!1})}function aB({w:a,d:b,h:c=.18,s:d,level:e}){let h=(0,g.useRef)(null),j=(0,g.useMemo)(()=>{let d=a/2-.02,e=b/2-.02;return[new o.cE(-d,c+.004,-e),new o.cE(d,c+.004,-e),new o.cE(d,c+.004,e),new o.cE(-d,c+.004,e),new o.cE(-d,c+.004,-e)]},[a,b,c]);return(0,i.f)(()=>{h.current&&(h.current.material.opacity=.15+.85*e(d.current))}),(0,f.jsxs)("group",{children:[(0,f.jsx)("mesh",{geometry:_(a,c,b,.05),position:[0,c/2,0],castShadow:!0,receiveShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#26211d",roughness:.5,metalness:.5})}),(0,f.jsx)(Q,{ref:a=>{h.current=a},points:j,color:S,lineWidth:1.8,transparent:!0,opacity:.2,toneMapped:!1})]})}function aC({s:a,level:b,r:c=.5,count:d=3}){let e=(0,g.useRef)([]);return(0,i.f)(({clock:c})=>{let f=b(a.current);e.current.forEach((a,b)=>{if(!a)return;let e=(.5*c.elapsedTime+b/d)%1;a.scale.setScalar(.5+2.1*e),a.material.opacity=f*(1-e)*.5,a.visible=f>.02})}),(0,f.jsx)(f.Fragment,{children:Array.from({length:d}).map((a,b)=>(0,f.jsx)("mesh",{ref:a=>{e.current[b]=a},geometry:$(`t${c}_0.012`,()=>new o.fa(c,.012,8,96)),rotation:[Math.PI/2,0,0],children:(0,f.jsx)("meshBasicMaterial",{color:S,toneMapped:!1,transparent:!0,opacity:0,depthWrite:!1})},b))})}let aD=a=>Math.max(Y(0,1,.3,a),X(3.45,3.85,a));function aE({s:a,on:b}){let c=an(520,1060,ao,a),d=(0,g.useRef)(null);return(0,i.f)(({clock:b})=>{let c=b.elapsedTime,e=1-X(.45,.9,a.current);d.current&&(d.current.position.y=1.78+.025*Math.sin(1.2*c),d.current.rotation.z=e*Math.sin(38*c)*.012)}),(0,f.jsxs)("group",{position:ab,rotation:[0,.5,0],children:[(0,f.jsx)(aB,{w:2.8,d:2.8,s:a,level:aD}),(0,f.jsx)(az,{text:"Customer",on:b,y:3.85}),(0,f.jsx)("group",{position:[0,.2,0],children:(0,f.jsx)(aC,{s:a,r:.55,level:a=>Math.max(Y(.05,2.2,.3,a),.8*X(3.45,3.85,a))})}),(0,f.jsx)("mesh",{geometry:$("y0.5_0.1",()=>new o.o1(.5,.5,.1,64)),position:[0,.23,0],castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#2b2622",roughness:.35,metalness:.7})}),(0,f.jsxs)("group",{ref:d,position:[0,1.78,0],rotation:[-.06,0,0],children:[(0,f.jsx)("mesh",{geometry:_(1.32,2.68,.15,.2),castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:U,roughness:.28,metalness:.9,envMapIntensity:1.3})}),(0,f.jsx)("mesh",{geometry:_(1.2,2.56,.02,.15),position:[0,0,.078],children:(0,f.jsx)("meshStandardMaterial",{color:"#050403",roughness:.1,metalness:.3})}),(0,f.jsxs)("mesh",{position:[0,0,.092],children:[(0,f.jsx)("planeGeometry",{args:[1.2,2.56]}),(0,f.jsx)("meshBasicMaterial",{map:c,toneMapped:!1,transparent:!0,alphaTest:.5})]}),(0,f.jsx)("mesh",{geometry:_(.03,.34,.05,.015),position:[-.665,.5,0],children:(0,f.jsx)("meshStandardMaterial",{color:U,roughness:.3,metalness:.9})}),(0,f.jsx)("mesh",{geometry:_(.03,.5,.05,.015),position:[.665,.35,0],children:(0,f.jsx)("meshStandardMaterial",{color:U,roughness:.3,metalness:.9})})]})]})}let aF=[-1.75,-.9,.9,1.75],aG=[-1.1,0,1.1],aH=(d=[],e=(a,b)=>d.push(new o.cE(...a),new o.cE(...b)),aF.forEach(a=>e([a,.206,-1.1],[a,.206,1.1])),[-1.1,1.1].forEach(a=>{for(let b=0;b<aF.length-1;b++)e([aF[b],.206,a],[aF[b+1],.206,a])}),e([-2.4,.206,0],[-1.75,.206,0]),e([-1.75,.206,0],[-.9,.206,0]),e([-.9,.206,0],[-.6,.206,0]),e([.6,.206,0],[.9,.206,0]),e([.9,.206,0],[1.75,.206,0]),e([1.75,.206,0],[2.4,.206,0]),d),aI=new o.Es(S),aJ=new o.Es("#5a5148"),aK=new o.cE;function aL({s:a,on:b}){let c=an(640,200,ap,a),d=(0,g.useRef)([]),e=(0,g.useRef)([]),h=(0,g.useMemo)(()=>aF.flatMap(a=>aG.map(b=>({x:a,z:b}))),[]);return(0,i.f)(()=>{let b=a.current;ad.at(ah(b),aK);let c=Y(.9,2.1,.4,b);h.forEach((a,c)=>{let e=d.current[c];if(!e)return;let f=b<.95?0:o.rB.clamp((aK.x-a.x)/.6+.2,0,1);e.color.copy(aJ).lerp(aI,0===a.z?f:.7*f)}),e.current.forEach((a,b)=>{a&&(a.position.y=.1+b*(.19+.035*c))})}),(0,f.jsxs)("group",{children:[(0,f.jsx)(aB,{w:5,d:3.4,h:.2,s:a,level:a=>Y(.9,2,.35,a)}),(0,f.jsx)(az,{text:"Edge network",on:b,y:2}),(0,f.jsx)(Q,{points:aH,segments:!0,color:"#7a6f64",lineWidth:1,transparent:!0,opacity:.85}),h.map((a,b)=>(0,f.jsxs)("group",{position:[a.x,.2,a.z],children:[(0,f.jsx)("mesh",{geometry:_(.5,.16,.5,.04),position:[0,.08,0],castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#2a2420",roughness:.4,metalness:.7})}),(0,f.jsx)("mesh",{geometry:_(.14,.02,.14,.01),position:[0,.17,0],children:(0,f.jsx)("meshBasicMaterial",{ref:a=>{d.current[b]=a},color:"#5a5148",toneMapped:!1})})]},b)),(0,f.jsx)("group",{position:[0,.3,0],children:[0,1,2].map(a=>(0,f.jsx)("mesh",{ref:b=>{e.current[a]=b},geometry:_(1.15,.15,1.15,.04),position:[0,.1+.19*a,0],castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:2===a?"#3a332e":"#241f1b",roughness:.35,metalness:.8,envMapIntensity:1.2})},a))}),(0,f.jsxs)("group",{position:[0,.7,-2.15],rotation:[-.1,0,0],children:[(0,f.jsx)("mesh",{geometry:_(2.6,.82,.07,.07),castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:U,roughness:.3,metalness:.85})}),(0,f.jsxs)("mesh",{position:[0,0,.04],children:[(0,f.jsx)("planeGeometry",{args:[2.5,.78]}),(0,f.jsx)("meshBasicMaterial",{map:c,toneMapped:!1,transparent:!0,alphaTest:.5})]})]})]})}let aM=[1.5,2.45,3.4,4.35],aN=a=>Y(1.9,3.6,.3,a);function aO({s:a,on:b}){let c=an(640,200,aq,a),d=an(780,240,av,a),e=an(780,240,aw,a),h=an(780,240,ax,a),j=an(780,240,ay,a),k=(0,g.useRef)([]),l=(0,g.useRef)([]);return(0,i.f)(()=>{let b=a.current;k.current.forEach((a,c)=>{if(!a)return;let d=at(c,b);a.position.z=o.rB.lerp(a.position.z,-.2+.32*d,.12);let e=l.current[c];e&&(e.material.opacity=d)})}),(0,f.jsxs)("group",{position:ac,rotation:[0,-.5,0],children:[(0,f.jsx)(aB,{w:3.2,d:3,s:a,level:aN}),(0,f.jsx)(az,{text:"Aurlynn agent",on:b,y:5.35}),(0,f.jsxs)("group",{position:[0,.18,.85],children:[(0,f.jsx)("mesh",{geometry:_(2.5,.6,.9,.07),position:[0,.3,0],castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#241f1b",roughness:.4,metalness:.75})}),(0,f.jsxs)("mesh",{position:[0,.3,.456],children:[(0,f.jsx)("planeGeometry",{args:[2.36,.5]}),(0,f.jsx)("meshBasicMaterial",{map:c,toneMapped:!1,transparent:!0,alphaTest:.5})]})]}),[-1.45,1.45].map(a=>(0,f.jsx)("mesh",{geometry:_(.08,4.5,.14,.03),position:[a,2.45,-.2],castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#2a2420",roughness:.35,metalness:.8})},a)),[d,e,h,j].map((a,b)=>(0,f.jsxs)("group",{ref:a=>{k.current[b]=a},position:[0,aM[b],-.2],children:[(0,f.jsx)("mesh",{geometry:_(2.74,.84,.08,.08),castShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#0f0d0b",roughness:.3,metalness:.5})}),(0,f.jsxs)("mesh",{position:[0,0,.045],children:[(0,f.jsx)("planeGeometry",{args:[2.7,.8]}),(0,f.jsx)("meshBasicMaterial",{map:a,toneMapped:!1,transparent:!0,alphaTest:.5})]}),(0,f.jsx)("mesh",{ref:a=>{l.current[b]=a},geometry:_(.05,.84,.1,.02),position:[-1.4,0,0],children:(0,f.jsx)("meshBasicMaterial",{color:3===b?V:S,transparent:!0,opacity:0,toneMapped:!1})})]},b))]})}let aP=ad.dense(),aQ=ag.dense(),aR=new o.cE;function aS({s:a}){let b=(0,g.useRef)([]),c=(0,g.useRef)([]);return(0,i.f)(({clock:d})=>{let e=d.elapsedTime,f=a.current,g=X(.08,.4,f)*(1-X(3,3.4,f)),h=ah(f);b.current.forEach((a,b)=>{if(!a)return;let c=(.1*e+b/8)%1,d=ad.at(c*h,aR);a.position.copy(aR),a.rotation.y=d,a.scale.setScalar(Math.max(1e-4,g*Math.pow(Math.sin(Math.PI*c),.55)))});let i=X(3,3.2,f),j=X(3,3.9,f);c.current.forEach((a,b)=>{if(!a)return;let c=(.11*e+b/8)%1,d=ag.at(c*j,aR);a.position.copy(aR),a.rotation.y=d,a.scale.setScalar(Math.max(1e-4,i*Math.pow(Math.sin(Math.PI*c),.55)))})}),(0,f.jsxs)("group",{children:[(0,f.jsx)(Q,{points:aP,color:W,lineWidth:1.1,transparent:!0,opacity:.22,dashed:!0,dashSize:.1,gapSize:.09}),(0,f.jsx)(Q,{points:aQ,color:W,lineWidth:1.1,transparent:!0,opacity:.22,dashed:!0,dashSize:.1,gapSize:.09}),(0,f.jsx)(aA,{pts:aP,color:S,width:2.4,s:a,level:ah}),(0,f.jsx)(aA,{pts:aQ,color:V,width:2.4,s:a,level:a=>X(3,3.9,a)}),Array.from({length:8}).map((a,c)=>(0,f.jsx)("group",{ref:a=>{b.current[c]=a},scale:1e-4,children:(0,f.jsx)("mesh",{geometry:_(.3,.07,.12,.03),position:[0,.06,0],children:(0,f.jsx)("meshBasicMaterial",{color:S,toneMapped:!1})})},`f${c}`)),Array.from({length:8}).map((a,b)=>(0,f.jsx)("group",{ref:a=>{c.current[b]=a},scale:1e-4,children:(0,f.jsx)("mesh",{geometry:_(.3,.07,.12,.03),position:[0,.06,0],children:(0,f.jsx)("meshBasicMaterial",{color:V,toneMapped:!1})})},`b${b}`))]})}let aT=(()=>{let a=[];for(let b=-9;b<=9;b++)a.push(new o.cE(b,.004,-4.2),new o.cE(b,.004,4.2));for(let b=-4;b<=4;b++)a.push(new o.cE(-9.2,.004,b),new o.cE(9.2,.004,b));return a})();function aU(){return(0,f.jsxs)("group",{children:[(0,f.jsx)("mesh",{geometry:_(19.6,.3,9.2,.1),position:[0,-.15,0],receiveShadow:!0,children:(0,f.jsx)("meshStandardMaterial",{color:"#ebe4d8",roughness:.85,metalness:0})}),(0,f.jsx)(Q,{points:aT,segments:!0,color:W,lineWidth:1,transparent:!0,opacity:.07})]})}let aV=[ab,[0,0,0],ac],aW=new o.cE,aX=new o.cE;function aY({s:a}){let{camera:b,size:c,pointer:d}=(0,j.f)(),e=(0,g.useRef)(new o.cE);return(0,i.f)(()=>{let f=a.current,g=o.rB.clamp(f-.5,0,2),h=Math.min(1,Math.floor(g)),i=X(0,1,g-h),j=aV[h],k=aV[h+1];aW.set(o.rB.lerp(j[0],k[0],i),0,o.rB.lerp(j[2],k[2],i));let l=X(2.95,3.9,f);aW.x=o.rB.lerp(aW.x,0,l),aW.z=o.rB.lerp(aW.z,-.6,l);let m=17*Math.max(1,1.05/(c.width/c.height)),n=o.rB.lerp(m,1.6*m,l),p=o.rB.lerp(-.28,.26,f/4);aX.set(.55*Math.sin(p),.46,1).normalize().multiplyScalar(n),b.position.set(aW.x+aX.x+.45*d.x,.6+aX.y+.2*d.y,aW.z+aX.z),e.current.set(aW.x,.8+.2*l,aW.z),b.lookAt(e.current)}),null}function aZ({sRef:a,progress:b}){return(0,i.f)((c,d)=>{a.current=o.rB.damp(a.current,4*b.current,3.2,Math.min(d,.05))},-1),null}function a$({progress:a,active:b}){let c=(0,g.useRef)(4*a.current);return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(aZ,{sRef:c,progress:a}),(0,f.jsx)(aY,{s:c}),(0,f.jsx)("ambientLight",{intensity:.5}),(0,f.jsx)("directionalLight",{position:[3,15,7],intensity:1.9,color:"#fff3e2",castShadow:!0,"shadow-mapSize":[4096,4096],"shadow-camera-left":-11,"shadow-camera-right":11,"shadow-camera-top":7,"shadow-camera-bottom":-7,"shadow-camera-near":1,"shadow-camera-far":40,"shadow-bias":-6e-4,"shadow-normalBias":.05,"shadow-radius":4}),(0,f.jsx)("directionalLight",{position:[-8,5,-5],intensity:.45,color:"#dbe6ff"}),(0,f.jsxs)(l.f,{resolution:256,frames:1,children:[(0,f.jsx)(m.f,{form:"rect",intensity:3,position:[0,8,6],scale:[16,5,1],color:"#fff3e2"}),(0,f.jsx)(m.f,{form:"rect",intensity:1.4,position:[-9,3,2],rotation:[0,Math.PI/2,0],scale:[8,4,1],color:"#ffffff"}),(0,f.jsx)(m.f,{form:"rect",intensity:1,position:[9,2,-3],rotation:[0,-Math.PI/2,0],scale:[8,4,1],color:"#ffd9b0"})]}),(0,f.jsx)(aU,{}),(0,f.jsx)(aS,{s:c}),(0,f.jsx)(aE,{s:c,on:0===b||3===b}),(0,f.jsx)(aL,{s:c,on:1===b}),(0,f.jsx)(aO,{s:c,on:b>=2})]})}a.s(["default",0,function({progress:a,active:b,dpr:c}){let d=(0,g.useRef)(null),[e,i]=(0,g.useState)(!0);return(0,g.useEffect)(()=>{let a=d.current;if(!a)return;let b=new IntersectionObserver(([a])=>i(a.isIntersecting),{rootMargin:"100px"});return b.observe(a),()=>b.disconnect()},[]),(0,f.jsx)("div",{ref:d,className:"absolute inset-0",children:(0,f.jsx)(h.f,{shadows:"percentage",frameloop:e?"always":"never",dpr:[1,c],camera:{fov:32,near:.1,far:120,position:[-4,6,14]},gl:{alpha:!0,antialias:!0},children:(0,f.jsx)(a$,{progress:a,active:b})})})}],95448)}];

//# sourceMappingURL=src_components_workflow_HowItWorks3D_jsx_13w-4qepd5hzi._.js.map