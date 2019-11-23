import React from 'react';

import {
  IpData,
  ITracerouteReply,
  TracerouteResponseType,
} from '../types/generated';
import CountryFlag from './CountryFlag';
import {milliseconds} from '../format';
import {TracerouteResponse as TracerouteResponseData} from '../types/protobuf';

type Props = {
  index: number;
  ipData?: IpData | undefined;
  response: TracerouteResponseData;
};

export default function TracerouteResponse(props: Props) {
  const {response} = props;
  let seq = props.index + 1;
  let contents;
  switch (response.responseCase) {
    case TracerouteResponseType.Reply:
      contents = (
        <TracerouteReply ipData={props.ipData} reply={response.reply} />
      );
      seq = response.reply.seq;
      break;

    case TracerouteResponseType.Error:
      contents = <p>Error: {response.error.message}</p>;
      break;

    case TracerouteResponseType.Timeout:
      contents = <p>Timed Out</p>;
      seq = response.timeout.seq;
      break;
  }

  return (
    <li className="list-group-item">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">{contents}</div>
        <span className="tracert-seq mr-2">{seq}</span>
      </div>
    </li>
  );
}

type ReplyProps = {
  ipData: IpData | undefined;
  reply: ITracerouteReply;
};

function TracerouteReply(props: ReplyProps) {
  const {ipData, reply} = props;
  const metadata: Array<React.ReactNode> = [];
  if (ipData) {
    if (ipData.countryIso) {
      metadata.push(
        <>
          <CountryFlag country={ipData.countryIso} />
          {[ipData.city, ipData.country].filter(Boolean).join(', ')}
        </>,
      );
    }
    if (ipData.asn) {
      metadata.push(`AS${ipData.asn} ${ipData.asnName}`);
    }
  }

  return (
    <>
      <span className="badge badge-secondary">{milliseconds(reply.rtt)}</span>{' '}
      {ipData && ipData.hostName ? (
        <>
          <strong>{ipData.hostName}</strong> ({reply.ip})
        </>
      ) : (
        <strong>{reply.ip}</strong>
      )}{' '}
      <ul className="list-inline text-muted">
        {metadata.map((item, index) => (
          <li className="list-inline-item" key={index}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}