(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,57667,e=>{"use strict";let t,n,i,r;var s=e.i(43476),a=e.i(71645),o=e.i(75056),l=e.i(98903),c=e.i(38408),f=e.i(20840),d=e.i(43257),u=e.i(48455),p=e.i(31067),h=e.i(90072),m=h,x=h;let g=new x.VQ,y=new x.cE;class S extends x.Kx{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new x.ki([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new x.ki([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new x.hC(t,6,1);return this.setAttribute("instanceStart",new x.Zq(n,3,0)),this.setAttribute("instanceEnd",new x.Zq(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let i=new x.hC(n,2*t,1);return this.setAttribute("instanceColorStart",new x.Zq(i,t,0)),this.setAttribute("instanceColorEnd",new x.Zq(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new x.nw(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new x.VQ);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),g.setFromBufferAttribute(t),this.boundingBox.union(g))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new x.L0),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,s=e.count;r<s;r++)y.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(y)),y.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(y));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var v=h,w=e.i(8560),b=e.i(31497);class E extends v.Zg{constructor(e){super({type:"LineMaterial",uniforms:v.SP.clone(v.SP.merge([w.O.common,w.O.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new v.wq(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${b.f>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let M=b.f>=125?"uv1":"uv2",j=new m.$i,A=new m.cE,_=new m.cE,L=new m.$i,P=new m.$i,T=new m.$i,z=new m.cE,U=new m.nd,B=new m._i,C=new m.cE,O=new m.VQ,R=new m.L0,I=new m.$i;function N(e,t,i){return I.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),I.multiplyScalar(1/I.w),I.x=n/i.width,I.y=n/i.height,I.applyMatrix4(e.projectionMatrixInverse),I.multiplyScalar(1/I.w),Math.abs(Math.max(I.x,I.y))}class D extends m.kE{constructor(e=new S,t=new E({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)A.fromBufferAttribute(t,e),_.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+A.distanceTo(_);let r=new m.hC(i,2,1);return e.setAttribute("instanceDistanceStart",new m.Zq(r,1,0)),e.setAttribute("instanceDistanceEnd",new m.Zq(r,1,1)),this}raycast(e,i){let r,s,a=this.material.worldUnits,o=e.camera;null!==o||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,f=this.geometry,d=this.material;if(n=d.linewidth+l,null===f.boundingSphere&&f.computeBoundingSphere(),R.copy(f.boundingSphere).applyMatrix4(c),a)r=.5*n;else{let e=Math.max(o.near,R.distanceToPoint(t.origin));r=N(o,e,d.resolution)}if(R.radius+=r,!1!==t.intersectsSphere(R)){if(null===f.boundingBox&&f.computeBoundingBox(),O.copy(f.boundingBox).applyMatrix4(c),a)s=.5*n;else{let e=Math.max(o.near,O.distanceToPoint(t.origin));s=N(o,e,d.resolution)}O.expandByScalar(s),!1!==t.intersectsBox(O)&&(a?function(e,i){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,o=s.attributes.instanceEnd,l=Math.min(s.instanceCount,a.count);for(let s=0;s<l;s++){B.start.fromBufferAttribute(a,s),B.end.fromBufferAttribute(o,s),B.applyMatrix4(r);let l=new m.cE,c=new m.cE;t.distanceSqToSegment(B.start,B.end,c,l),c.distanceTo(l)<.5*n&&i.push({point:c,pointOnLine:l,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[M]:null})}}(this,i):function(e,i,r){let s=i.projectionMatrix,a=e.material.resolution,o=e.matrixWorld,l=e.geometry,c=l.attributes.instanceStart,f=l.attributes.instanceEnd,d=Math.min(l.instanceCount,c.count),u=-i.near;t.at(1,T),T.w=1,T.applyMatrix4(i.matrixWorldInverse),T.applyMatrix4(s),T.multiplyScalar(1/T.w),T.x*=a.x/2,T.y*=a.y/2,T.z=0,z.copy(T),U.multiplyMatrices(i.matrixWorldInverse,o);for(let i=0;i<d;i++){if(L.fromBufferAttribute(c,i),P.fromBufferAttribute(f,i),L.w=1,P.w=1,L.applyMatrix4(U),P.applyMatrix4(U),L.z>u&&P.z>u)continue;if(L.z>u){let e=L.z-P.z,t=(L.z-u)/e;L.lerp(P,t)}else if(P.z>u){let e=P.z-L.z,t=(P.z-u)/e;P.lerp(L,t)}L.applyMatrix4(s),P.applyMatrix4(s),L.multiplyScalar(1/L.w),P.multiplyScalar(1/P.w),L.x*=a.x/2,L.y*=a.y/2,P.x*=a.x/2,P.y*=a.y/2,B.start.copy(L),B.start.z=0,B.end.copy(P),B.end.z=0;let l=B.closestPointToPointParameter(z,!0);B.at(l,C);let d=m.rB.lerp(L.z,P.z,l),p=d>=-1&&d<=1,h=z.distanceTo(C)<.5*n;if(p&&h){B.start.fromBufferAttribute(c,i),B.end.fromBufferAttribute(f,i),B.start.applyMatrix4(o),B.end.applyMatrix4(o);let n=new m.cE,s=new m.cE;t.distanceSqToSegment(B.start,B.end,s,n),r.push({point:s,pointOnLine:n,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:i,uv:null,[M]:null})}}}(this,o,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(j),this.material.uniforms.resolution.value.set(j.z,j.w))}}class $ extends S{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let i=0;i<t;i+=3)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,i=new Float32Array(2*n);if(3===t)for(let r=0;r<n;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];else for(let r=0;r<n;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5],i[2*r+6]=e[r+6],i[2*r+7]=e[r+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class W extends D{constructor(e=new $,t=new E({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let k=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:i,lineWidth:r,segments:s,dashed:o,...l},f){var d,u;let m=(0,c.f)(e=>e.size),x=a.useMemo(()=>s?new D:new W,[s]),[g]=a.useState(()=>new E),y=(null==n||null==(d=n[0])?void 0:d.length)===4?4:3,v=a.useMemo(()=>{let i=s?new S:new $,r=e.map(e=>{let t=Array.isArray(e);return e instanceof h.cE||e instanceof h.$i?[e.x,e.y,e.z]:e instanceof h.wq?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(r.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof h.Es?e.toArray():e);i.setColors(e.flat(),y)}return i},[e,s,n,y]);return a.useLayoutEffect(()=>{x.computeLineDistances()},[e,x]),a.useLayoutEffect(()=>{o?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[o,g]),a.useEffect(()=>()=>{v.dispose(),g.dispose()},[v]),a.createElement("primitive",(0,p.f)({object:x,ref:f},l),a.createElement("primitive",{object:v,attach:"geometry"}),a.createElement("primitive",(0,p.f)({object:g,attach:"material",color:t,vertexColors:!!n,resolution:[m.width,m.height],linewidth:null!=(u=null!=i?i:r)?u:1,dashed:o,transparent:4===y},l)))});var H=e.i(34297);let G="#e0a56e",F="#9a6a44",V="#3b3631",q="#12a37a",Z="#0a0a0b",Y=(e,t,n)=>{let i=h.rB.clamp((n-e)/(t-e),0,1);return i*i*(3-2*i)},Q=(e,t,n,i)=>Y(e-n,e,i)*(1-Y(t,t+n,i)),K=new Map;function X(e,t){let n=K.get(e);return n||(n=t(),K.set(e,n)),n}let J=(e,t,n,i)=>X(`b${e}_${t}_${n}_${i}`,()=>new H.f(e,t,n,5,i));class ee{pts;cum=[0];len;constructor(e){this.pts=e.map(e=>new h.cE(...e));for(let e=1;e<this.pts.length;e++)this.cum.push(this.cum[e-1]+this.pts[e].distanceTo(this.pts[e-1]));this.len=this.cum[this.cum.length-1]}at(e,t){let n=h.rB.clamp(e,0,1)*this.len,i=1;for(;i<this.cum.length-1&&this.cum[i]<n;)i++;let r=this.pts[i-1],s=this.pts[i],a=this.cum[i]-this.cum[i-1]||1;return t.lerpVectors(r,s,(n-this.cum[i-1])/a),Math.atan2(-(s.z-r.z),s.x-r.x)}ratio(e){return this.cum[e]/this.len}dense(e=.12){let t=[this.pts[0].clone()];for(let n=1;n<this.pts.length;n++){let i=this.pts[n-1],r=this.pts[n],s=Math.max(1,Math.round(i.distanceTo(r)/e));for(let e=1;e<=s;e++)t.push(new h.cE().lerpVectors(i,r,e/s))}return t}}let et=[-5.6,0,1.3],en=[5.6,0,-1.3],ei=new ee([[-4.3,.025,1],[-3.3,.025,1],[-3.3,.025,0],[-2.55,.025,0],[-2.4,.215,0],[-1.75,.215,0],[-.9,.215,0],[0,.215,0],[.9,.215,0],[1.75,.215,0],[2.4,.215,0],[2.55,.025,0],[3.3,.025,0],[3.3,.025,-1.3],[4.2,.025,-1.3]]),er=ei.ratio(4),es=ei.ratio(10),ea=new ee([[5.6,.025,-2.75],[5.6,.025,-3.3],[-5.6,.025,-3.3],[-5.6,.025,-.15]]);function eo(e){return e<1?h.rB.lerp(.02,er,Y(.05,.95,e)):e<2?h.rB.lerp(er,es,Y(1,1.9,e)):h.rB.lerp(es,1,Y(2,2.35,e))}let el=null;function ec(){if(!el){let e=getComputedStyle(document.documentElement),t=(t,n)=>{let i=e.getPropertyValue(t).trim();return i?`${i}, ${n}`:n};el={sans:t("--font-inter","system-ui, sans-serif"),mono:t("--font-jetbrains","ui-monospace, monospace")}}return el}function ef(e,t,n,i,r,s){e.beginPath(),e.roundRect(t,n,i,r,s)}function ed(e,t,n,i,r,s,a="left"){e.font=r,e.fillStyle=s,e.textAlign=a,e.textBaseline="alphabetic",e.fillText(t,n,i)}function eu(e){e.needsUpdate=!0}function ep(e,t,n,i,r=12){let s=(0,a.useMemo)(()=>{let n=document.createElement("canvas");n.width=e,n.height=t;let i=n.getContext("2d"),r=new h.Nk(n);return r.colorSpace=h.nj,r.anisotropy=8,{ctx:i,tex:r}},[e,t]),o=(0,a.useRef)(-1);return(0,a.useEffect)(()=>()=>s.tex.dispose(),[s]),(0,l.f)(({clock:e})=>{let t=e.elapsedTime;t-o.current<1/r||(o.current=t,n(s.ctx,i.current,t),eu(s.tex))}),s.tex}function eh(e,t,n){let i=ec(),r=1-Y(.45,.9,t),s=Y(.05,.35,t)*(1-Y(2.2,2.6,t)),a=Y(3,3.3,t);e.clearRect(0,0,520,1060),ef(e,0,0,520,1060,56),e.fillStyle="#0e0c0a",e.fill(),ed(e,"AURLYNN · INBOUND",40,74,`500 21px ${i.mono}`,"#8c8279"),ed(e,"SRTP",480,74,`500 21px ${i.mono}`,a>.5?q:G,"right");if(r>.05){let t=.9*n%1;e.strokeStyle=`rgba(224,165,110,${(1-t)*.5*r})`,e.lineWidth=3,e.beginPath(),e.arc(260,262,78+44*t,0,2*Math.PI),e.stroke()}if(e.beginPath(),e.arc(260,262,76,0,2*Math.PI),e.fillStyle="#1c1814",e.fill(),e.strokeStyle=a>.5?q:G,e.lineWidth=3,e.stroke(),ed(e,"C",260,282,`600 58px ${i.sans}`,"#f4efe7","center"),ed(e,"Customer",260,408,`600 44px ${i.sans}`,"#f4efe7","center"),ed(e,"+1 (415) 555-0142",260,452,`400 27px ${i.sans}`,"#8c8279","center"),r>.5){let t=.55+.45*Math.abs(Math.sin(4*n));ed(e,"Incoming call…",260,510,`500 28px ${i.sans}`,`rgba(224,165,110,${t})`,"center")}else{let n=Math.round(47*Y(.3,3.7,t)),r=String(Math.floor(n/60)).padStart(2,"0"),s=String(n%60).padStart(2,"0");e.beginPath(),e.arc(164,502,7,0,2*Math.PI),e.fillStyle=q,e.fill(),ed(e,"Connected",182,512,`500 28px ${i.sans}`,"#f4efe7","left"),ed(e,`${r}:${s}`,410,512,`500 30px ${i.mono}`,"#cfc6ba","right")}ed(e,a>.5?"AURLYNN AI":"CUSTOMER",40,584,`500 19px ${i.mono}`,"#8c8279");let o=5*r+46*s+46*a;for(let t=0;t<30;t++){let i=40+t/29*440,r=6+o*(.35+.65*Math.sin(t/29*Math.PI))*(.35+.65*Math.abs(Math.sin(7*n+.9*t)));ef(e,i-4,660-r,8,2*r,4),e.fillStyle=a>.5?q:G,e.fill()}ef(e,36,746,448,76,20),e.fillStyle="#171310",e.fill(),ed(e,"VOICE · ENCRYPTED",62,792,`500 20px ${i.mono}`,"#cfc6ba");let l=a>.5?-1:1;for(let t=0;t<3;t++){let i=((1.4*n-.25*t)%1+1)%1;e.fillStyle=`rgba(${a>.5?"18,163,122":"224,165,110"},${.25+.75*(1-i)})`;let r=402+(1===l?t:2-t)*22;e.beginPath(),1===l?(e.moveTo(r,770),e.lineTo(r+14,780),e.lineTo(r,790)):(e.moveTo(r+14,770),e.lineTo(r,780),e.lineTo(r+14,790)),e.closePath(),e.fill()}["Phone","Web","App"].forEach((t,n)=>{let r=36+154*n;ef(e,r,852,140,56,28),0===n?(e.fillStyle="rgba(224,165,110,.16)",e.fill(),e.strokeStyle=G):e.strokeStyle="#3a342e",e.lineWidth=2,e.stroke(),ed(e,t,r+70,888,`500 23px ${i.sans}`,0===n?"#f4efe7":"#8c8279","center")}),[150,260,370].forEach((t,n)=>{if(e.beginPath(),e.arc(t,968,36,0,2*Math.PI),e.fillStyle=2===n?"#c2392b":"#1c1814",e.fill(),e.fillStyle="#f4efe7",0===n&&(ef(e,t-6,950,12,26,6),e.fill()),1===n)for(let n=0;n<3;n++)for(let i=0;i<3;i++)e.fillRect(t-15+12*i,953+12*n,7,7);2===n&&(ef(e,t-16,962,32,9,4),e.fill())})}function em(e,t,n){let i=ec(),r=Math.round(87*Y(.9,1.7,t)),s=Q(.9,2.1,.4,t);e.clearRect(0,0,640,200),ef(e,0,0,640,200,22),e.fillStyle="#14110f",e.fill(),e.strokeStyle=s>.2?G:"#3a342e",e.lineWidth=2,e.stroke(),ed(e,"EDGE ROUTER",32,48,`500 20px ${i.mono}`,"#8c8279"),ed(e,"TLS 1.3 · SRTP · AES-256",32,78,`500 18px ${i.mono}`,s>.2?G:"#6b625a"),ed(e,t<.9?"—":String(r).padStart(3,"0"),30,160,`500 84px ${i.mono}`,"#f4efe7"),ed(e,"ms",172,160,`500 26px ${i.mono}`,"#8c8279"),ed(e,"END-TO-END LATENCY",232,160,`500 16px ${i.mono}`,"#6b625a"),["SIN","FRA","IAD"].forEach((t,r)=>{let a=40+44*r;ed(e,t,468,a+14,`500 18px ${i.mono}`,"#8c8279"),ef(e,516,a,92,12,6),e.fillStyle="#2a241f",e.fill(),ef(e,516,a,92*(.25+s*(.5+.2*Math.sin(2*n+r))),12,6),e.fillStyle=G,e.fill()})}function ex(e,t,n){let i=ec();e.clearRect(0,0,640,200),ef(e,0,0,640,200,22),e.fillStyle="#14110f",e.fill(),e.save(),e.translate(34,40),e.scale(4.2,4.2),e.fillStyle="#f4efe7",e.fill(new Path2D("M16 2 28 24H4L16 2Z")),e.strokeStyle=F,e.lineWidth=1.6,e.stroke(new Path2D("M4 24 16 14l12 10")),e.fillStyle="#e7c6a4",e.beginPath(),e.arc(16,19,2.2,0,2*Math.PI),e.fill(),e.restore(),e.letterSpacing="8px",ed(e,"AURLYNN",190,92,`500 40px ${i.sans}`,"#f4efe7"),e.letterSpacing="3px",ed(e,"VOICE AGENT",192,130,`500 18px ${i.mono}`,"#8c8279"),e.letterSpacing="0px";let r=t<1.2?0:t<2.3?1:t<3?2:3,s=[{t:"STANDBY",c:"#8c8279"},{t:"LISTENING",c:G},{t:"PROCESSING",c:G},{t:"RESPONDING",c:q}][r];e.beginPath(),e.arc(196,166,7,0,2*Math.PI),e.fillStyle=s.c,e.globalAlpha=0===r?1:.55+.45*Math.abs(Math.sin(4*n)),e.fill(),e.globalAlpha=1,ed(e,s.t,214,173,`500 22px ${i.mono}`,s.c)}let eg="“Can I book a table for Friday at 7?”",ey=[[1,1.3,2.5,2.7],[2.3,2.5,2.75,2.9],[2.6,2.8,3.05,3.2],[3,3.25,99,100]],eS=(e,t)=>{let[n,i,r,s]=ey[e];return Y(n,i,t)*(1-Y(r,s,t))};function ev(e,t,n,i,r){let s=ec();e.clearRect(0,0,780,240),ef(e,0,0,780,240,26),e.fillStyle="#14110f",e.fill(),e.strokeStyle=t>.3?G:"#3a342e",e.lineWidth=2.5,e.stroke(),e.beginPath(),e.arc(40,46,7,0,2*Math.PI),e.fillStyle=t>.3?G:"#4a423b",e.fill(),e.letterSpacing="2px",ed(e,`${n}  ${i}`,60,53,`500 21px ${s.mono}`,t>.3?"#f4efe7":"#8c8279"),ed(e,r,744,53,`500 18px ${s.mono}`,"#6b625a","right"),e.letterSpacing="0px"}function ew(e,t,n){let i=ec(),r=eS(0,t);ev(e,r,"01","LISTEN","ASR · STREAMING");let s=Math.floor(eg.length*Y(1.5,2.35,t));ed(e,eg.slice(0,s)+(r>.3&&Math.floor(2*n)%2==0&&s<eg.length?"▍":""),40,130,`500 32px ${i.sans}`,"#f4efe7");for(let t=0;t<40;t++){let i=4+22*r*Math.abs(Math.sin(6*n+.8*t))*(.4+.6*Math.sin(t/40*Math.PI));ef(e,40+17.5*t,196-i/2,7,i,3),e.fillStyle=r>.3?G:"#3a342e",e.fill()}}function eb(e,t){let n=ec();ev(e,eS(1,t),"02","UNDERSTAND","INTENT · ENTITIES");let i=Y(2.3,2.55,t);i>.05?(e.globalAlpha=i,ef(e,40,86,332,50,25),e.fillStyle=F,e.fill(),ed(e,"Intent · Book reservation",62,120,`500 25px ${n.sans}`,"#fff"),ed(e,"CONFIDENCE",40,176,`500 17px ${n.mono}`,"#8c8279"),ef(e,190,162,400,12,6),e.fillStyle="#2a241f",e.fill(),ef(e,190,162,Math.max(12,384*Y(2.35,2.7,t)),12,6),e.fillStyle=G,e.fill(),ed(e,`${Math.round(96*Y(2.35,2.7,t))}%`,740,175,`500 22px ${n.mono}`,"#f4efe7","right"),ed(e,"Fri · 7:00 PM · Party of 2",40,218,`400 21px ${n.sans}`,"#8c8279"),e.globalAlpha=1):ed(e,"Waiting for utterance…",40,130,`400 26px ${n.sans}`,"#4a423b")}function eE(e,t,n){let i=ec(),r=eS(2,t);ev(e,r,"03","ACT","TOOL EXECUTION"),["Check availability","Create booking","Send confirmation"].forEach((s,a)=>{let o=100+44*a,l=Y(2.65+.1*a,2.76+.1*a,t),c=0===a?1:Y(2.65+(a-1)*.1,2.76+(a-1)*.1,t),f=r>.3&&l<.5&&c>.5;e.beginPath(),e.arc(52,o-8,13,0,2*Math.PI),l>.5?(e.fillStyle=q,e.fill(),e.strokeStyle="#fff",e.lineWidth=3,e.beginPath(),e.moveTo(45,o-8),e.lineTo(50,o-3),e.lineTo(59,o-14)):(e.strokeStyle=f?G:"#4a423b",e.lineWidth=3,f&&(e.beginPath(),e.arc(52,o-8,13,6*n,6*n+1.3*Math.PI))),e.stroke(),ed(e,s,82,o,`500 26px ${i.sans}`,l>.5?"#f4efe7":"#8c8279"),ed(e,l>.5?"DONE":f?"RUNNING":"QUEUED",740,o,`500 17px ${i.mono}`,l>.5?q:f?G:"#4a423b","right")})}function eM(e,t,n){let i=ec(),r=eS(3,t);ev(e,r,"04","RESPOND","TTS · NEURAL VOICE"),ed(e,"“You’re all set for Friday at 7 PM.”",40,116,`500 30px ${i.sans}`,r>.2?"#f4efe7":"#6b625a");for(let t=0;t<38;t++){let i=5+24*r*Math.abs(Math.sin(6.5*n+.7*t))*(.4+.6*Math.sin(t/38*Math.PI));ef(e,40+12.2*t,168-i/2,6,i,3),e.fillStyle=r>.2?q:"#3a342e",e.fill()}ef(e,520,150,224,52,26),e.strokeStyle="#3a342e",e.lineWidth=2,e.stroke(),e.beginPath(),e.arc(548,176,6,0,2*Math.PI),e.fillStyle=q,e.fill(),ed(e,"Human handoff · standby",562,183,`500 17px ${i.sans}`,"#cfc6ba")}function ej({text:e,on:t,y:n}){let{ctx:i,tex:r}=(0,a.useMemo)(()=>{let e=document.createElement("canvas");e.width=520,e.height=96;let t=new h.Nk(e);return t.colorSpace=h.nj,t.anisotropy=4,{ctx:e.getContext("2d"),tex:t}},[]);return(0,a.useEffect)(()=>()=>r.dispose(),[r]),(0,a.useEffect)(()=>{let n;n=ec(),i.clearRect(0,0,520,96),ef(i,4,8,512,80,40),i.fillStyle=t?Z:"rgba(255,255,255,.88)",i.fill(),i.strokeStyle=t?Z:"rgba(10,10,11,.18)",i.lineWidth=3,i.stroke(),i.letterSpacing="5px",ed(i,e.toUpperCase(),262,60,`500 30px ${n.mono}`,t?"#ffffff":"#55555c","center"),i.letterSpacing="0px",eu(r)},[i,r,e,t]),(0,s.jsx)(f.f,{position:[0,n,0],children:(0,s.jsxs)("mesh",{renderOrder:10,children:[(0,s.jsx)("planeGeometry",{args:[2.6,.48]}),(0,s.jsx)("meshBasicMaterial",{map:r,transparent:!0,toneMapped:!1,depthTest:!1})]})})}function eA({pts:e,color:t,width:n,s:i,level:r}){let o=(0,a.useRef)(null),c=e.length-1;return(0,l.f)(()=>{o.current&&(o.current.geometry.instanceCount=Math.floor(c*h.rB.clamp(r(i.current),0,1)))}),(0,s.jsx)(k,{ref:e=>{o.current=e},points:e,color:t,lineWidth:n,toneMapped:!1})}function e_({w:e,d:t,h:n=.18,s:i,level:r}){let o=(0,a.useRef)(null),c=(0,a.useMemo)(()=>{let i=e/2-.02,r=t/2-.02;return[new h.cE(-i,n+.004,-r),new h.cE(i,n+.004,-r),new h.cE(i,n+.004,r),new h.cE(-i,n+.004,r),new h.cE(-i,n+.004,-r)]},[e,t,n]);return(0,l.f)(()=>{o.current&&(o.current.material.opacity=.15+.85*r(i.current))}),(0,s.jsxs)("group",{children:[(0,s.jsx)("mesh",{geometry:J(e,n,t,.05),position:[0,n/2,0],castShadow:!0,receiveShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#26211d",roughness:.5,metalness:.5})}),(0,s.jsx)(k,{ref:e=>{o.current=e},points:c,color:G,lineWidth:1.8,transparent:!0,opacity:.2,toneMapped:!1})]})}function eL({s:e,level:t,r:n=.5,count:i=3}){let r=(0,a.useRef)([]);return(0,l.f)(({clock:n})=>{let s=t(e.current);r.current.forEach((e,t)=>{if(!e)return;let r=(.5*n.elapsedTime+t/i)%1;e.scale.setScalar(.5+2.1*r),e.material.opacity=s*(1-r)*.5,e.visible=s>.02})}),(0,s.jsx)(s.Fragment,{children:Array.from({length:i}).map((e,t)=>(0,s.jsx)("mesh",{ref:e=>{r.current[t]=e},geometry:X(`t${n}_0.012`,()=>new h.fa(n,.012,8,96)),rotation:[Math.PI/2,0,0],children:(0,s.jsx)("meshBasicMaterial",{color:G,toneMapped:!1,transparent:!0,opacity:0,depthWrite:!1})},t))})}let eP=e=>Math.max(Q(0,1,.3,e),Y(3.45,3.85,e));function eT({s:e,on:t}){let n=ep(520,1060,eh,e),i=(0,a.useRef)(null);return(0,l.f)(({clock:t})=>{let n=t.elapsedTime,r=1-Y(.45,.9,e.current);i.current&&(i.current.position.y=1.78+.025*Math.sin(1.2*n),i.current.rotation.z=r*Math.sin(38*n)*.012)}),(0,s.jsxs)("group",{position:et,rotation:[0,.5,0],children:[(0,s.jsx)(e_,{w:2.8,d:2.8,s:e,level:eP}),(0,s.jsx)(ej,{text:"Customer",on:t,y:3.85}),(0,s.jsx)("group",{position:[0,.2,0],children:(0,s.jsx)(eL,{s:e,r:.55,level:e=>Math.max(Q(.05,2.2,.3,e),.8*Y(3.45,3.85,e))})}),(0,s.jsx)("mesh",{geometry:X("y0.5_0.1",()=>new h.o1(.5,.5,.1,64)),position:[0,.23,0],castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#2b2622",roughness:.35,metalness:.7})}),(0,s.jsxs)("group",{ref:i,position:[0,1.78,0],rotation:[-.06,0,0],children:[(0,s.jsx)("mesh",{geometry:J(1.32,2.68,.15,.2),castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:V,roughness:.28,metalness:.9,envMapIntensity:1.3})}),(0,s.jsx)("mesh",{geometry:J(1.2,2.56,.02,.15),position:[0,0,.078],children:(0,s.jsx)("meshStandardMaterial",{color:"#050403",roughness:.1,metalness:.3})}),(0,s.jsxs)("mesh",{position:[0,0,.092],children:[(0,s.jsx)("planeGeometry",{args:[1.2,2.56]}),(0,s.jsx)("meshBasicMaterial",{map:n,toneMapped:!1,transparent:!0,alphaTest:.5})]}),(0,s.jsx)("mesh",{geometry:J(.03,.34,.05,.015),position:[-.665,.5,0],children:(0,s.jsx)("meshStandardMaterial",{color:V,roughness:.3,metalness:.9})}),(0,s.jsx)("mesh",{geometry:J(.03,.5,.05,.015),position:[.665,.35,0],children:(0,s.jsx)("meshStandardMaterial",{color:V,roughness:.3,metalness:.9})})]})]})}let ez=[-1.75,-.9,.9,1.75],eU=[-1.1,0,1.1],eB=(i=[],r=(e,t)=>i.push(new h.cE(...e),new h.cE(...t)),ez.forEach(e=>r([e,.206,-1.1],[e,.206,1.1])),[-1.1,1.1].forEach(e=>{for(let t=0;t<ez.length-1;t++)r([ez[t],.206,e],[ez[t+1],.206,e])}),r([-2.4,.206,0],[-1.75,.206,0]),r([-1.75,.206,0],[-.9,.206,0]),r([-.9,.206,0],[-.6,.206,0]),r([.6,.206,0],[.9,.206,0]),r([.9,.206,0],[1.75,.206,0]),r([1.75,.206,0],[2.4,.206,0]),i),eC=new h.Es(G),eO=new h.Es("#5a5148"),eR=new h.cE;function eI({s:e,on:t}){let n=ep(640,200,em,e),i=(0,a.useRef)([]),r=(0,a.useRef)([]),o=(0,a.useMemo)(()=>ez.flatMap(e=>eU.map(t=>({x:e,z:t}))),[]);return(0,l.f)(()=>{let t=e.current;ei.at(eo(t),eR);let n=Q(.9,2.1,.4,t);o.forEach((e,n)=>{let r=i.current[n];if(!r)return;let s=t<.95?0:h.rB.clamp((eR.x-e.x)/.6+.2,0,1);r.color.copy(eO).lerp(eC,0===e.z?s:.7*s)}),r.current.forEach((e,t)=>{e&&(e.position.y=.1+t*(.19+.035*n))})}),(0,s.jsxs)("group",{children:[(0,s.jsx)(e_,{w:5,d:3.4,h:.2,s:e,level:e=>Q(.9,2,.35,e)}),(0,s.jsx)(ej,{text:"Edge network",on:t,y:2}),(0,s.jsx)(k,{points:eB,segments:!0,color:"#7a6f64",lineWidth:1,transparent:!0,opacity:.85}),o.map((e,t)=>(0,s.jsxs)("group",{position:[e.x,.2,e.z],children:[(0,s.jsx)("mesh",{geometry:J(.5,.16,.5,.04),position:[0,.08,0],castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#2a2420",roughness:.4,metalness:.7})}),(0,s.jsx)("mesh",{geometry:J(.14,.02,.14,.01),position:[0,.17,0],children:(0,s.jsx)("meshBasicMaterial",{ref:e=>{i.current[t]=e},color:"#5a5148",toneMapped:!1})})]},t)),(0,s.jsx)("group",{position:[0,.3,0],children:[0,1,2].map(e=>(0,s.jsx)("mesh",{ref:t=>{r.current[e]=t},geometry:J(1.15,.15,1.15,.04),position:[0,.1+.19*e,0],castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:2===e?"#3a332e":"#241f1b",roughness:.35,metalness:.8,envMapIntensity:1.2})},e))}),(0,s.jsxs)("group",{position:[0,.7,-2.15],rotation:[-.1,0,0],children:[(0,s.jsx)("mesh",{geometry:J(2.6,.82,.07,.07),castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:V,roughness:.3,metalness:.85})}),(0,s.jsxs)("mesh",{position:[0,0,.04],children:[(0,s.jsx)("planeGeometry",{args:[2.5,.78]}),(0,s.jsx)("meshBasicMaterial",{map:n,toneMapped:!1,transparent:!0,alphaTest:.5})]})]})]})}let eN=[1.5,2.45,3.4,4.35],eD=e=>Q(1.9,3.6,.3,e);function e$({s:e,on:t}){let n=ep(640,200,ex,e),i=ep(780,240,ew,e),r=ep(780,240,eb,e),o=ep(780,240,eE,e),c=ep(780,240,eM,e),f=(0,a.useRef)([]),d=(0,a.useRef)([]);return(0,l.f)(()=>{let t=e.current;f.current.forEach((e,n)=>{if(!e)return;let i=eS(n,t);e.position.z=h.rB.lerp(e.position.z,-.2+.32*i,.12);let r=d.current[n];r&&(r.material.opacity=i)})}),(0,s.jsxs)("group",{position:en,rotation:[0,-.5,0],children:[(0,s.jsx)(e_,{w:3.2,d:3,s:e,level:eD}),(0,s.jsx)(ej,{text:"Aurlynn agent",on:t,y:5.35}),(0,s.jsxs)("group",{position:[0,.18,.85],children:[(0,s.jsx)("mesh",{geometry:J(2.5,.6,.9,.07),position:[0,.3,0],castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#241f1b",roughness:.4,metalness:.75})}),(0,s.jsxs)("mesh",{position:[0,.3,.456],children:[(0,s.jsx)("planeGeometry",{args:[2.36,.5]}),(0,s.jsx)("meshBasicMaterial",{map:n,toneMapped:!1,transparent:!0,alphaTest:.5})]})]}),[-1.45,1.45].map(e=>(0,s.jsx)("mesh",{geometry:J(.08,4.5,.14,.03),position:[e,2.45,-.2],castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#2a2420",roughness:.35,metalness:.8})},e)),[i,r,o,c].map((e,t)=>(0,s.jsxs)("group",{ref:e=>{f.current[t]=e},position:[0,eN[t],-.2],children:[(0,s.jsx)("mesh",{geometry:J(2.74,.84,.08,.08),castShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#0f0d0b",roughness:.3,metalness:.5})}),(0,s.jsxs)("mesh",{position:[0,0,.045],children:[(0,s.jsx)("planeGeometry",{args:[2.7,.8]}),(0,s.jsx)("meshBasicMaterial",{map:e,toneMapped:!1,transparent:!0,alphaTest:.5})]}),(0,s.jsx)("mesh",{ref:e=>{d.current[t]=e},geometry:J(.05,.84,.1,.02),position:[-1.4,0,0],children:(0,s.jsx)("meshBasicMaterial",{color:3===t?q:G,transparent:!0,opacity:0,toneMapped:!1})})]},t))]})}let eW=ei.dense(),ek=ea.dense(),eH=new h.cE;function eG({s:e}){let t=(0,a.useRef)([]),n=(0,a.useRef)([]);return(0,l.f)(({clock:i})=>{let r=i.elapsedTime,s=e.current,a=Y(.08,.4,s)*(1-Y(3,3.4,s)),o=eo(s);t.current.forEach((e,t)=>{if(!e)return;let n=(.1*r+t/8)%1,i=ei.at(n*o,eH);e.position.copy(eH),e.rotation.y=i,e.scale.setScalar(Math.max(1e-4,a*Math.pow(Math.sin(Math.PI*n),.55)))});let l=Y(3,3.2,s),c=Y(3,3.9,s);n.current.forEach((e,t)=>{if(!e)return;let n=(.11*r+t/8)%1,i=ea.at(n*c,eH);e.position.copy(eH),e.rotation.y=i,e.scale.setScalar(Math.max(1e-4,l*Math.pow(Math.sin(Math.PI*n),.55)))})}),(0,s.jsxs)("group",{children:[(0,s.jsx)(k,{points:eW,color:Z,lineWidth:1.1,transparent:!0,opacity:.22,dashed:!0,dashSize:.1,gapSize:.09}),(0,s.jsx)(k,{points:ek,color:Z,lineWidth:1.1,transparent:!0,opacity:.22,dashed:!0,dashSize:.1,gapSize:.09}),(0,s.jsx)(eA,{pts:eW,color:G,width:2.4,s:e,level:eo}),(0,s.jsx)(eA,{pts:ek,color:q,width:2.4,s:e,level:e=>Y(3,3.9,e)}),Array.from({length:8}).map((e,n)=>(0,s.jsx)("group",{ref:e=>{t.current[n]=e},scale:1e-4,children:(0,s.jsx)("mesh",{geometry:J(.3,.07,.12,.03),position:[0,.06,0],children:(0,s.jsx)("meshBasicMaterial",{color:G,toneMapped:!1})})},`f${n}`)),Array.from({length:8}).map((e,t)=>(0,s.jsx)("group",{ref:e=>{n.current[t]=e},scale:1e-4,children:(0,s.jsx)("mesh",{geometry:J(.3,.07,.12,.03),position:[0,.06,0],children:(0,s.jsx)("meshBasicMaterial",{color:q,toneMapped:!1})})},`b${t}`))]})}let eF=(()=>{let e=[];for(let t=-9;t<=9;t++)e.push(new h.cE(t,.004,-4.2),new h.cE(t,.004,4.2));for(let t=-4;t<=4;t++)e.push(new h.cE(-9.2,.004,t),new h.cE(9.2,.004,t));return e})();function eV(){return(0,s.jsxs)("group",{children:[(0,s.jsx)("mesh",{geometry:J(19.6,.3,9.2,.1),position:[0,-.15,0],receiveShadow:!0,children:(0,s.jsx)("meshStandardMaterial",{color:"#ebe4d8",roughness:.85,metalness:0})}),(0,s.jsx)(k,{points:eF,segments:!0,color:Z,lineWidth:1,transparent:!0,opacity:.07})]})}let eq=[et,[0,0,0],en],eZ=new h.cE,eY=new h.cE;function eQ({s:e}){let{camera:t,size:n,pointer:i}=(0,c.f)(),r=(0,a.useRef)(new h.cE);return(0,l.f)(()=>{let s=e.current,a=h.rB.clamp(s-.5,0,2),o=Math.min(1,Math.floor(a)),l=Y(0,1,a-o),c=eq[o],f=eq[o+1];eZ.set(h.rB.lerp(c[0],f[0],l),0,h.rB.lerp(c[2],f[2],l));let d=Y(2.95,3.9,s);eZ.x=h.rB.lerp(eZ.x,0,d),eZ.z=h.rB.lerp(eZ.z,-.6,d);let u=17*Math.max(1,1.05/(n.width/n.height)),p=h.rB.lerp(u,1.6*u,d),m=h.rB.lerp(-.28,.26,s/4);eY.set(.55*Math.sin(m),.46,1).normalize().multiplyScalar(p),t.position.set(eZ.x+eY.x+.45*i.x,.6+eY.y+.2*i.y,eZ.z+eY.z),r.current.set(eZ.x,.8+.2*d,eZ.z),t.lookAt(r.current)}),null}function eK({sRef:e,progress:t}){return(0,l.f)((n,i)=>{e.current=h.rB.damp(e.current,4*t.current,3.2,Math.min(i,.05))},-1),null}function eX({progress:e,active:t}){let n=(0,a.useRef)(4*e.current);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(eK,{sRef:n,progress:e}),(0,s.jsx)(eQ,{s:n}),(0,s.jsx)("ambientLight",{intensity:.5}),(0,s.jsx)("directionalLight",{position:[3,15,7],intensity:1.9,color:"#fff3e2",castShadow:!0,"shadow-mapSize":[4096,4096],"shadow-camera-left":-11,"shadow-camera-right":11,"shadow-camera-top":7,"shadow-camera-bottom":-7,"shadow-camera-near":1,"shadow-camera-far":40,"shadow-bias":-6e-4,"shadow-normalBias":.05,"shadow-radius":4}),(0,s.jsx)("directionalLight",{position:[-8,5,-5],intensity:.45,color:"#dbe6ff"}),(0,s.jsxs)(d.f,{resolution:256,frames:1,children:[(0,s.jsx)(u.f,{form:"rect",intensity:3,position:[0,8,6],scale:[16,5,1],color:"#fff3e2"}),(0,s.jsx)(u.f,{form:"rect",intensity:1.4,position:[-9,3,2],rotation:[0,Math.PI/2,0],scale:[8,4,1],color:"#ffffff"}),(0,s.jsx)(u.f,{form:"rect",intensity:1,position:[9,2,-3],rotation:[0,-Math.PI/2,0],scale:[8,4,1],color:"#ffd9b0"})]}),(0,s.jsx)(eV,{}),(0,s.jsx)(eG,{s:n}),(0,s.jsx)(eT,{s:n,on:0===t||3===t}),(0,s.jsx)(eI,{s:n,on:1===t}),(0,s.jsx)(e$,{s:n,on:t>=2})]})}e.s(["default",0,function({progress:e,active:t,dpr:n}){let i=(0,a.useRef)(null),[r,l]=(0,a.useState)(!0);return(0,a.useEffect)(()=>{let e=i.current;if(!e)return;let t=new IntersectionObserver(([e])=>l(e.isIntersecting),{rootMargin:"100px"});return t.observe(e),()=>t.disconnect()},[]),(0,s.jsx)("div",{ref:i,className:"absolute inset-0",children:(0,s.jsx)(o.f,{shadows:"percentage",frameloop:r?"always":"never",dpr:[1,n],camera:{fov:32,near:.1,far:120,position:[-4,6,14]},gl:{alpha:!0,antialias:!0},children:(0,s.jsx)(eX,{progress:e,active:t})})})}],57667)}]);