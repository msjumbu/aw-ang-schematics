
export const wsdl = `<?xml version="1.0"?>
<wsdl:definitions
	xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
	xmlns:tns="http://schemas.cordys.com/salesorderdatabasemetadata"
	xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
	xmlns:cordys="http://schemas.cordys.com/General/1.0/"
	name="salesorderWebServiceInterface"
	targetNamespace="http://schemas.cordys.com/salesorderdatabasemetadata">
	<wsdl:types>
		<xsd:schema
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			xmlns:wcp="http://schemas.cordys.com/"
			xmlns=""
			attributeFormDefault="unqualified"
			elementFormDefault="qualified"
			targetNamespace="http://schemas.cordys.com/salesorderdatabasemetadata">
			<xsd:import
				namespace="http://schemas.cordys.com/General/1.0/"
			/>
			<xsd:element
				name="GetScmSoSalesDistrictPriceMasterObjects">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element
							maxOccurs="1"
							minOccurs="0"
							ref="tns:cursor"
						/>
						<xsd:element
							name="fromMATERIAL_PRICE_ID">
							<xsd:simpleType>
								<xsd:restriction
									base="xsd:string">
									<xsd:pattern
										value="\{?[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}\}?"
									/>
									<xsd:maxLength
										value="36"
									/>
								</xsd:restriction>
							</xsd:simpleType>
						</xsd:element>
						<xsd:element
							name="toMATERIAL_PRICE_ID">
							<xsd:simpleType>
								<xsd:restriction
									base="xsd:string">
									<xsd:pattern
										value="\{?[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}\}?"
									/>
									<xsd:maxLength
										value="36"
									/>
								</xsd:restriction>
							</xsd:simpleType>
						</xsd:element>
					</xsd:sequence>
					<xsd:attributeGroup
						ref="tns:GetMethodAttributes"
					/>
				</xsd:complexType>
			</xsd:element>
			<xsd:element
				name="GetScmSoSalesDistrictPriceMasterObjectsResponse">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element
							maxOccurs="1"
							minOccurs="0"
							ref="tns:cursor"
						/>
						<xsd:element
							maxOccurs="unbounded"
							minOccurs="0"
							name="tuple">
							<xsd:complexType>
								<xsd:sequence>
									<xsd:element
										name="old">
										<xsd:complexType>
											<xsd:sequence>
												<xsd:element
													ref="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER"
												/>
											</xsd:sequence>
										</xsd:complexType>
									</xsd:element>
									<xsd:element
										maxOccurs="unbounded"
										minOccurs="0"
										ref="tns:values"
									/>
								</xsd:sequence>
								<xsd:attributeGroup
									ref="tns:tupleAttributes"
								/>
							</xsd:complexType>
						</xsd:element>
					</xsd:sequence>
					<xsd:attributeGroup
						ref="tns:GetMethodAttributes"
					/>
				</xsd:complexType>
			</xsd:element>
		</xsd:schema>
		<xsd:schema
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			xmlns:wcp="http://schemas.cordys.com/"
			xmlns=""
			elementFormDefault="qualified"
			targetNamespace="http://schemas.cordys.com/salesorderdatabasemetadata">
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTERModel">
				<xsd:sequence>
					<xsd:element
						name="MATERIAL_PRICE_ID"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_PRICE_IDWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="ENTITY_CODE"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_ENTITY_CODEWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="SALES_ORG"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_ORGWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="DIST_CHANNEL"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIST_CHANNELWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="DIVISION"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIVISIONWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="SALES_DISTRICT"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_DISTRICTWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="MATERIAL_CODE"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_CODEWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="PRICE"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_PRICEWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="CREATED_BY"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_BYWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="CREATED_ON"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_ONWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="MODIFIED_BY"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_BYWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
					<xsd:element
						name="MODIFIED_ON"
						nillable="true"
						type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_ONWithAttributes"
						minOccurs="0"
						maxOccurs="1"
					/>
				</xsd:sequence>
				<xsd:anyAttribute
					processContents="lax"
				/>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTERModelWithOldAttributes">
				<xsd:complexContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTERModel">
						<xsd:attributeGroup
							ref="tns:oldObjectAttributes"
						/>
					</xsd:extension>
				</xsd:complexContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTERModelWithNewAttributes">
				<xsd:complexContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTERModel">
						<xsd:attributeGroup
							ref="tns:newObjectAttributes"
						/>
					</xsd:extension>
				</xsd:complexContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_PRICE_IDWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_PRICE_IDType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_ENTITY_CODEWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_ENTITY_CODEType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_ORGWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_ORGType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIST_CHANNELWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIST_CHANNELType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIVISIONWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIVISIONType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_DISTRICTWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_DISTRICTType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_CODEWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_CODEType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_PRICEWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_PRICEType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_BYWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_BYType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_ONWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_ONType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_BYWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_BYType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:complexType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_ONWithAttributes">
				<xsd:simpleContent>
					<xsd:extension
						base="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_ONType">
						<xsd:attributeGroup
							ref="tns:elementAttributes"
						/>
					</xsd:extension>
				</xsd:simpleContent>
			</xsd:complexType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_PRICE_IDType">
				<xsd:restriction
					base="xsd:string">
					<xsd:pattern
						value="\{?[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}\}?"
					/>
					<xsd:pattern
						value="\{?[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}\}?"
					/>
					<xsd:maxLength
						value="36"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_ENTITY_CODEType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="10"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_ORGType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="4"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIST_CHANNELType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="2"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_DIVISIONType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="2"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_SALES_DISTRICTType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="10"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MATERIAL_CODEType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="20"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_PRICEType">
				<xsd:restriction
					base="xsd:double"
				/>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_BYType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="50"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_CREATED_ONType">
				<xsd:restriction
					base="xsd:date"
				/>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_BYType">
				<xsd:restriction
					base="xsd:string">
					<xsd:maxLength
						value="50"
					/>
				</xsd:restriction>
			</xsd:simpleType>
			<xsd:simpleType
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER_MODIFIED_ONType">
				<xsd:restriction
					base="xsd:date"
				/>
			</xsd:simpleType>
			<xsd:element
				name="SCM_SO_SALES_DISTRICT_PRICE_MASTER"
				type="tns:SCM_SO_SALES_DISTRICT_PRICE_MASTERModel"
			/>
		</xsd:schema>
		<xsd:schema
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			attributeFormDefault="unqualified"
			elementFormDefault="qualified"
			targetNamespace="http://schemas.cordys.com/salesorderdatabasemetadata">
			<xsd:import
				namespace="http://schemas.cordys.com/General/ClientAttributes/"
			/>
			<xsd:attributeGroup
				name="UpdateMethodAttributes">
				<xsd:attribute
					default="yes"
					name="reply">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="yes"
							/>
							<xsd:enumeration
								value="no"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default="no"
					name="commandUpdate">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="yes"
							/>
							<xsd:enumeration
								value="no"
							/>
							<xsd:enumeration
								value="true"
							/>
							<xsd:enumeration
								value="false"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default="no"
					name="preserveSpace">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="yes"
							/>
							<xsd:enumeration
								value="no"
							/>
							<xsd:enumeration
								value="true"
							/>
							<xsd:enumeration
								value="false"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default="no"
					name="batchUpdate">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="yes"
							/>
							<xsd:enumeration
								value="no"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:anyAttribute
					namespace="http://schemas.cordys.com/General/ClientAttributes/"
					processContents="strict"
				/>
			</xsd:attributeGroup>
			<xsd:attributeGroup
				name="tupleAttributes">
				<xsd:anyAttribute
					namespace="http://schemas.cordys.com/General/ClientAttributes/"
					processContents="strict"
				/>
			</xsd:attributeGroup>
			<xsd:attribute
				name="seqId"
				type="xsd:int"
			/>
			<xsd:attributeGroup
				name="oldObjectAttributes">
				<xsd:attribute
					default="0"
					name="qConstraint">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="0"
							/>
							<xsd:enumeration
								value="1"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
			</xsd:attributeGroup>
			<xsd:attributeGroup
				name="nestedObjectAttributes">
				<xsd:anyAttribute
					namespace="##targetNamespace"
					processContents="strict"
				/>
			</xsd:attributeGroup>
			<xsd:attributeGroup
				name="newObjectAttributes">
				<xsd:attribute
					default="0"
					name="qAccess">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="0"
							/>
							<xsd:enumeration
								value="1"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default="0"
					name="qConstraint">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="0"
							/>
							<xsd:enumeration
								value="1"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default="0"
					name="qInit">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="0"
							/>
							<xsd:enumeration
								value="1"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default=""
					name="qValues"
					type="xsd:string"
					use="optional"
				/>
			</xsd:attributeGroup>
			<xsd:attributeGroup
				name="GetMethodAttributes">
				<xsd:attribute
					default="no"
					name="preserveSpace">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="yes"
							/>
							<xsd:enumeration
								value="no"
							/>
							<xsd:enumeration
								value="true"
							/>
							<xsd:enumeration
								value="false"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default="0"
					name="qAccess">
					<xsd:simpleType>
						<xsd:restriction
							base="xsd:string">
							<xsd:enumeration
								value="0"
							/>
							<xsd:enumeration
								value="1"
							/>
						</xsd:restriction>
					</xsd:simpleType>
				</xsd:attribute>
				<xsd:attribute
					default=""
					name="qValues"
					type="xsd:string"
					use="optional"
				/>
				<xsd:anyAttribute
					namespace="http://schemas.cordys.com/General/ClientAttributes/"
					processContents="strict"
				/>
			</xsd:attributeGroup>
			<xsd:attributeGroup
				name="elementAttributes">
				<xsd:anyAttribute
					namespace="##any"
					processContents="skip"
				/>
			</xsd:attributeGroup>
			<xsd:element
				name="values">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element
							maxOccurs="unbounded"
							minOccurs="1"
							name="item">
							<xsd:complexType>
								<xsd:sequence>
									<xsd:element
										maxOccurs="1"
										minOccurs="1"
										name="label"
										type="xsd:string"
									/>
									<xsd:element
										maxOccurs="1"
										minOccurs="1"
										name="value"
										type="xsd:string"
									/>
								</xsd:sequence>
							</xsd:complexType>
						</xsd:element>
					</xsd:sequence>
					<xsd:attribute
						name="valuesID"
						type="xsd:string"
					/>
				</xsd:complexType>
			</xsd:element>
			<xsd:element
				name="cursor">
				<xsd:complexType>
					<xsd:attribute
						default="0"
						name="id"
						type="xsd:string"
					/>
					<xsd:attribute
						default="0"
						name="position"
						type="xsd:integer"
					/>
					<xsd:attribute
						default="5"
						name="numRows"
						type="xsd:integer"
					/>
					<xsd:attribute
						default="99999"
						name="maxRows"
						type="xsd:integer"
					/>
					<xsd:attribute
						default="false"
						name="sameConnection"
						type="xsd:boolean"
					/>
				</xsd:complexType>
			</xsd:element>
		</xsd:schema>
		<xsd:schema
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			targetNamespace="http://schemas.cordys.com/General/1.0/"
			elementFormDefault="qualified">
			<xsd:element
				name="FaultDetails">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element
							ref="cordys:LocalizableMessage"
						/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element
				name="FaultRelatedException"
				type="xsd:string">
                </xsd:element>
		</xsd:schema>
		<xsd:schema
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			targetNamespace="http://schemas.cordys.com/General/1.0/"
			elementFormDefault="qualified">
			<xsd:element
				name="LocalizableMessage">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element
							minOccurs="1"
							maxOccurs="1"
							name="MessageCode"
							type="xsd:string"
						/>
						<xsd:element
							minOccurs="0"
							maxOccurs="unbounded"
							name="Insertion"
							type="cordys:NestedMessage"
						/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:complexType
				name="NestedMessage"
				mixed="true">
				<xsd:sequence
					minOccurs="0">
					<xsd:element
						name="LocalizableMessage">
						<xsd:complexType>
							<xsd:sequence>
								<xsd:element
									minOccurs="1"
									maxOccurs="1"
									name="MessageCode"
									type="xsd:string"
								/>
								<xsd:element
									minOccurs="0"
									maxOccurs="unbounded"
									name="Insertion"
									type="cordys:NestedMessage"
								/>
							</xsd:sequence>
						</xsd:complexType>
					</xsd:element>
				</xsd:sequence>
			</xsd:complexType>
		</xsd:schema>
		<xsd:schema
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			targetNamespace="http://schemas.cordys.com/General/ClientAttributes/"
			elementFormDefault="qualified"
			attributeFormDefault="unqualified">
			<xsd:attribute
				name="sync_id"
				type="xsd:string"
			/>
			<xsd:attribute
				name="current_model"
				type="xsd:string"
			/>
			<xsd:attribute
				name="reorder"
				type="xsd:boolean"
			/>
			<xsd:attribute
				name="related"
				type="xsd:string"
			/>
			<xsd:attribute
				name="selected"
				type="xsd:boolean"
			/>
			<xsd:attribute
				name="activebusinessobject"
				type="xsd:boolean"
			/>
			<xsd:attribute
				name="delete"
				type="xsd:boolean"
			/>
		</xsd:schema>
	</wsdl:types>
	<wsdl:message
		name="GetScmSoSalesDistrictPriceMasterObjectsInput">
		<wsdl:part
			name="body"
			element="tns:GetScmSoSalesDistrictPriceMasterObjects"
		/>
	</wsdl:message>
	<wsdl:message
		name="GetScmSoSalesDistrictPriceMasterObjectsOutput">
		<wsdl:part
			name="body"
			element="tns:GetScmSoSalesDistrictPriceMasterObjectsResponse"
		/>
	</wsdl:message>
	<wsdl:message
		name="GetScmSoSalesDistrictPriceMasterObjectsFaultDetail">
		<wsdl:part
			name="FaultDetail"
			element="cordys:FaultDetails"
		/>
	</wsdl:message>
	<wsdl:portType
		name="salesorderWsappWebServiceInterface">
		<wsdl:operation
			name="GetScmSoSalesDistrictPriceMasterObjects">
			<wsdl:input
				message="tns:GetScmSoSalesDistrictPriceMasterObjectsInput"
			/>
			<wsdl:output
				message="tns:GetScmSoSalesDistrictPriceMasterObjectsOutput"
			/>
			<wsdl:fault
				name="FaultDetail"
				message="tns:GetScmSoSalesDistrictPriceMasterObjectsFaultDetail"
			/>
		</wsdl:operation>
	</wsdl:portType>
	<wsdl:binding
		name="salesorderWsappWebServiceInterface"
		type="tns:salesorderWsappWebServiceInterface">
		<soap:binding
			style="document"
			transport="http://schemas.xmlsoap.org/soap/http"
		/>
		<wsdl:operation
			name="GetScmSoSalesDistrictPriceMasterObjects">
			<soap:operation
				soapAction=""
				style="document"
			/>
			<wsdl:input>
				<soap:body
					use="literal"
				/>
			</wsdl:input>
			<wsdl:output>
				<soap:body
					use="literal"
				/>
			</wsdl:output>
			<wsdl:fault
				name="FaultDetail">
				<soap:fault
					name="FaultDetail"
					use="literal"
				/>
			</wsdl:fault>
		</wsdl:operation>
	</wsdl:binding>
	<wsdl:service
		name="salesorderWsappWebServiceInterfaceService">
		<wsdl:port
			name="salesorderWsappWebServiceInterface"
			binding="tns:salesorderWsappWebServiceInterface">
			<soap:address
				location="http://10.96.75.123:81/home/PTP/com.eibus.web.soap.Gateway.wcp?organization=o=PTP,cn=cordys,cn=defaultInst,o=lab.opentext.com"
			/>
		</wsdl:port>
		<wsdl:port
			name="salesorderWsappWebServiceInterfacePort"
			binding="tns:salesorderWsappWebServiceInterface">
			<soap:address
				location="http://10.96.75.123:81/home/PTP/com.eibus.web.soap.Gateway.wcp?organization=o=PTP,cn=cordys,cn=defaultInst,o=lab.opentext.com"
			/>
		</wsdl:port>
	</wsdl:service>
</wsdl:definitions>
`;